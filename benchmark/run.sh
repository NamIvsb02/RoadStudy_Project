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

REDIS=roadstudy-bench-redis-1
redis_cli() { docker exec "$REDIS" redis-cli -a bench --no-auth-warning "$@"; }
# Chỉ khi chạy với Redis bật. REDIS_KILL_AFTER=<giây>: dừng Redis giữa lúc đang tải để đo lúc Redis chết
USE_REDIS=${REDIS_URL:+1}

psql_db() { docker exec "$DB" psql -U bench -d bench -tAc "$1"; }

for VUS in $LEVELS; do
  OUT="results/$LABEL/vus$VUS"
  rm -f "$OUT".stats "$OUT".conns "$OUT".stop "$OUT".calls
  psql_db "SELECT pg_stat_statements_reset();" >/dev/null
  if [ -n "$USE_REDIS" ]; then
    docker start "$REDIS" >/dev/null 2>&1 || true
    sleep 2
    redis_cli FLUSHALL >/dev/null && redis_cli CONFIG RESETSTAT >/dev/null # mỗi mức bắt đầu với cache trống
    if [ -n "${REDIS_KILL_AFTER:-}" ]; then
      ( sleep "$REDIS_KILL_AFTER"; docker stop -t 0 "$REDIS" >/dev/null 2>&1 ) &
    fi
  fi
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
  if [ -n "$USE_REDIS" ] && [ -z "${REDIS_KILL_AFTER:-}" ]; then
    # get = 2 lượt mỗi request qua cache (phiên bản + dữ liệu), set = 1 lượt mỗi lần phải tải từ DB
    GETS=$(redis_cli INFO commandstats | awk -F"[:,=]" '$1=="cmdstat_get"{print $3}')
    SETS=$(redis_cli INFO commandstats | awk -F"[:,=]" '$1=="cmdstat_set"{print $3}')
    MEM=$(redis_cli INFO memory | awk -F: '$1=="used_memory"{gsub(/[^0-9]/,"",$2);print $2}')
    echo "get=${GETS:-0} set=${SETS:-0} mem=${MEM:-0}" > "$OUT.redis"
  fi
  wait "$SAMPLER" 2>/dev/null || true
  psql_db "SELECT coalesce(sum(calls),0) FROM pg_stat_statements WHERE dbid=(SELECT oid FROM pg_database WHERE datname='bench') AND query NOT ILIKE '%pg_stat_statements%'" > "$OUT.calls"
  rm -f "$OUT.stop"
  sleep 5 # cho hệ thống nghỉ giữa các mức
done

node summarize.js "$LABEL"
