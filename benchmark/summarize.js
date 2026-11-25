// Tổng hợp kết quả benchmark thành bảng Markdown.
//   node benchmark/summarize.js <nhãn>                       in và lưu results/<nhãn>.md
//   node benchmark/summarize.js so-sanh <nhãn1> <nhãn2>      so sánh hai lần đo
const fs = require("fs");
const path = require("path");

const dir = (label) => path.join(__dirname, "results", label);
const ENDPOINTS = ["category", "teacher", "course_by_category", "course_list", "course_search", "course_detail"];
const num = (v, d = 0) => (typeof v === "number" ? v.toFixed(d) : "-");
const readLines = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8").split("\n").map((l) => l.trim()).filter(Boolean) : []);

function mb(text) {
  const m = /([\d.]+)\s*(KiB|MiB|GiB)/.exec(text || "");
  return m ? Number(m[1]) * { KiB: 1 / 1024, MiB: 1, GiB: 1024 }[m[2]] : 0;
}

function loadLevel(label, vus) {
  const base = path.join(dir(label), `vus${vus}`);
  if (!fs.existsSync(`${base}.json`)) return null;
  const k6 = JSON.parse(fs.readFileSync(`${base}.json`, "utf8")).metrics;
  const stats = readLines(`${base}.stats`).map((l) => ({ cpu: parseFloat(l), mem: mb(l) }));
  const conns = readLines(`${base}.conns`).map(Number).filter((n) => !Number.isNaN(n));
  const calls = Number(readLines(`${base}.calls`)[0] || 0);
  const redisLine = readLines(`${base}.redis`)[0] || "";
  const rg = Number(/get=(\d+)/.exec(redisLine)?.[1] || 0);
  const rs = Number(/set=(\d+)/.exec(redisLine)?.[1] || 0);
  const rm = Number(/mem=(\d+)/.exec(redisLine)?.[1] || 0);
  const lookups = rg / 2; // mỗi lần tra cache = GET phiên bản + GET dữ liệu
  const dur = k6.http_req_duration;
  const reqs = k6.http_reqs;
  const failed = k6.http_req_failed;
  const perEndpoint = Object.fromEntries(ENDPOINTS.map((e) => [e, k6[`http_req_duration{endpoint:${e}}`]]));
  return {
    vus,
    avg: dur.avg,
    p50: dur.med,
    p95: dur["p(95)"],
    p99: dur["p(99)"],
    max: dur.max,
    rps: reqs.rate,
    total: reqs.count,
    errorRate: (failed.value ?? failed.rate ?? 0) * 100,
    queries: calls,
    queriesPerReq: reqs.count ? calls / reqs.count : 0,
    cpuMax: Math.max(0, ...stats.map((s) => s.cpu)),
    memMax: Math.max(0, ...stats.map((s) => s.mem)),
    connsMax: Math.max(0, ...conns),
    perEndpoint,
    cacheHit: lookups > 0 ? Math.max(0, (1 - rs / lookups) * 100) : null,
    redisMb: rm / 1048576,
  };
}

const levelsOf = (label) =>
  fs.readdirSync(dir(label)).filter((f) => /^vus\d+\.json$/.test(f)).map((f) => Number(/\d+/.exec(f)[0])).sort((a, b) => a - b);

function table(label) {
  const levels = levelsOf(label).map((v) => loadLevel(label, v)).filter(Boolean);
  let md = `### Kết quả: ${label}\n\n`;
  const hasRedis = levels.some((l) => l.cacheHit !== null);
  md += "| Người dùng đồng thời | Trung bình (ms) | P50 | P95 | P99 | Req/giây | Lỗi (%) | Truy vấn SQL | SQL/request | CPU tối đa (%) | RAM tối đa (MB) | Kết nối DB tối đa |" + (hasRedis ? " Cache hit (%) | Redis RAM (MB) |" : "") + "\n";
  md += "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |" + (hasRedis ? " --- | --- |" : "") + "\n";
  for (const l of levels) {
    const redisCols = hasRedis ? ` ${l.cacheHit === null ? "-" : num(l.cacheHit, 1)} | ${num(l.redisMb, 1)} |` : "";
    md += `| ${l.vus} | ${num(l.avg)} | ${num(l.p50)} | ${num(l.p95)} | ${num(l.p99)} | ${num(l.rps, 1)} | ${num(l.errorRate, 2)} | ${l.queries} | ${num(l.queriesPerReq, 1)} | ${num(l.cpuMax)} | ${num(l.memMax)} | ${l.connsMax} |${redisCols}\n`;
  }
  md += "\nP95 (ms) theo từng API:\n\n| Người dùng | " + ENDPOINTS.join(" | ") + " |\n| --- |" + ENDPOINTS.map(() => " --- |").join("") + "\n";
  for (const l of levels) md += `| ${l.vus} | ${ENDPOINTS.map((e) => num(l.perEndpoint[e]?.["p(95)"])).join(" | ")} |\n`;
  return md;
}

function compare(a, b) {
  const levels = levelsOf(a).filter((v) => levelsOf(b).includes(v));
  const pct = (x, y) => (x ? `${(((y - x) / x) * 100).toFixed(0)}%` : "-");
  let md = `### So sánh: ${a} (trước) và ${b} (sau)\n\n`;
  md += "| Người dùng | P95 trước → sau (ms) | Thay đổi | P99 trước → sau (ms) | Req/giây trước → sau | Lỗi % trước → sau | SQL/request trước → sau |\n| --- | --- | --- | --- | --- | --- | --- |\n";
  for (const v of levels) {
    const x = loadLevel(a, v);
    const y = loadLevel(b, v);
    md += `| ${v} | ${num(x.p95)} → ${num(y.p95)} | ${pct(x.p95, y.p95)} | ${num(x.p99)} → ${num(y.p99)} | ${num(x.rps, 1)} → ${num(y.rps, 1)} | ${num(x.errorRate, 2)} → ${num(y.errorRate, 2)} | ${num(x.queriesPerReq, 1)} → ${num(y.queriesPerReq, 1)} |\n`;
  }
  return md;
}

const [cmd, a, b] = process.argv.slice(2);
let out;
if (cmd === "so-sanh") out = compare(a, b);
else {
  out = table(cmd);
  fs.writeFileSync(path.join(__dirname, "results", `${cmd}.md`), out);
}
console.log("\n" + out);
