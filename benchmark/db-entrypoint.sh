#!/bin/sh
# Giả lập độ trễ mạng giữa backend và database (chỉ áp dụng cho gói tin DB gửi đi), rồi chạy Postgres như bình thường.
if [ "${DB_LATENCY_MS:-0}" -gt 0 ]; then
  if apk add --no-cache iproute2 >/dev/null 2>&1 && tc qdisc replace dev eth0 root netem delay "${DB_LATENCY_MS}ms" "5ms"; then
    echo "[bench] đã giả lập độ trễ DB ${DB_LATENCY_MS}ms"
  else
    echo "[bench] CẢNH BÁO: không áp dụng được độ trễ, số đo sẽ lạc quan hơn thực tế"
  fi
fi
exec docker-entrypoint.sh "$@"
