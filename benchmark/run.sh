#!/usr/bin/env bash
# Đo hiệu năng các API đọc công khai trên môi trường CÔ LẬP (Postgres local trong Docker, có giả lập độ trễ như Supabase).
#
#   benchmark/run.sh <nhãn> [mức tải...]        ví dụ: benchmark/run.sh truoc 10 50 100 200
#   node benchmark/summarize.js so-sanh <nhãn1> <nhãn2>   so sánh hai lần đo
#   benchmark/run.sh --down                     dừng và xóa toàn bộ môi trường đo (container, volume, image)
#
# Không dùng DB Supabase, Cloudinary hay Gemini; không đọc BE_RStudy/.env. Kết quả nằm ở benchmark/results/<nhãn>/.
# Muốn đổi biến (độ trễ DB, kích thước pool) thì sửa benchmark/bench.env rồi chạy lại.
set -euo pipefail
cd "$(dirname "$0")"
export MSYS_NO_PATHCONV=1 # Git Bash trên Windows: không đổi đường dẫn /scripts thành đường dẫn Windows
DC="docker compose --env-file bench.env -f docker-compose.yml"
BACKEND=roadstudy-bench-backend-1
DB=roadstudy-bench-db-1

if [ "${1:-}" = "--down" ]; then
  $DC down -v --rmi local
  exit 0
fi

LABEL=${1:?"Thiếu nhãn. Ví dụ: benchmark/run.sh truoc 10 50 100 200"}
shift
LEVELS=${*:-"10 50 100 200"}
WIN_PWD=$(pwd -W 2>/dev/null || pwd)
mkdir -p "results/$LABEL"

echo "== Dựng môi trường đo (backend build từ code hiện tại)"
$DC up -d --build --wait --wait-timeout 180

echo "== Migration và dữ liệu mẫu (chạy trong container, DB benchmark)"
$DC exec -T backend npx prisma migrate deploy 2>&1 | tail -2
$DC cp seed.js backend:/tmp/seed.js
$DC exec -T backend node /tmp/seed.js
$DC exec -T db psql -U bench -d bench -qc "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"
$DC restart backend >/dev/null # khởi động lại để kết nối và bộ nhớ ở trạng thái sạch
sleep 6

psql_db() { docker exec "$DB" psql -U bench -d bench -tAc "$1"; }

for VUS in $LEVELS; do
  OUT="results/$LABEL/vus$VUS"
  rm -f "$OUT".stats "$OUT".conns "$OUT".stop "$OUT".calls
  psql_db "SELECT pg_stat_statements_reset();" >/dev/null
  echo "== Mức $VUS người dùng đồng thời"
  (
    while [ ! -f "$OUT.stop" ]; do
      docker stats --no-stream --format '{{.CPUPerc}} {{.MemUsage}}' "$BACKEND" >> "$OUT.stats" 2>/dev/null || true
      psql_db "SELECT count(*) FROM pg_stat_activity WHERE datname='bench' AND backend_type='client backend' AND pid <> pg_backend_pid()" >> "$OUT.conns" 2>/dev/null || true
      sleep 1
    done
  ) &
  SAMPLER=$!
  docker run --rm --network roadstudy-bench_default \
    -v "$WIN_PWD/k6:/scripts:ro" -v "$WIN_PWD/results/$LABEL:/results" \
    grafana/k6 run -e BASE=http://backend:5000 -e VUS="$VUS" --summary-export="/results/vus$VUS.json" /scripts/public.js \
    > "$OUT.k6.log" 2>&1 || echo "   (k6 báo ngưỡng/lỗi, xem $OUT.k6.log)"
  touch "$OUT.stop"
  wait "$SAMPLER" 2>/dev/null || true
  psql_db "SELECT coalesce(sum(calls),0) FROM pg_stat_statements WHERE dbid=(SELECT oid FROM pg_database WHERE datname='bench') AND query NOT ILIKE '%pg_stat_statements%'" > "$OUT.calls"
  rm -f "$OUT.stop"
  sleep 5 # cho hệ thống nghỉ giữa các mức
done

node summarize.js "$LABEL"
