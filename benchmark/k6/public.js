// Kịch bản đo các API đọc công khai, mô phỏng một lượt xem trang chủ rồi duyệt khóa học.
// Chạy qua benchmark/run.sh. Biến: BASE (http://backend:5000), VUS (số người dùng đồng thời).
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE || "http://backend:5000";
const VUS = Number(__ENV.VUS || 10);
const HOLD = __ENV.HOLD || "40s";

const ENDPOINTS = ["category", "teacher", "course_by_category", "course_list", "course_search", "course_detail"];

export const options = {
  stages: [
    { duration: "10s", target: VUS }, // tăng từ từ
    { duration: HOLD, target: VUS },
    { duration: "5s", target: 0 },
  ],
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
  // Khai báo ngưỡng giả để k6 xuất số đo riêng từng endpoint trong summary-export
  thresholds: Object.fromEntries(ENDPOINTS.map((name) => [`http_req_duration{endpoint:${name}}`, ["max>=0"]])),
};

export function setup() {
  const categories = http.get(`${BASE}/api/category?limit=100`).json("data.items");
  const categoryIds = categories.filter((c) => c.courseCount > 0).map((c) => c.id);
  const courses = http.get(`${BASE}/api/course?limit=100`).json("data.items");
  return { categoryIds, courseIds: courses.map((c) => c.id) };
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function get(path, endpoint) {
  const res = http.get(`${BASE}${path}`, { tags: { endpoint } });
  check(res, { "status 200": (r) => r.status === 200 });
  return res;
}

export default function (data) {
  // Trang chủ: danh mục, giáo viên, 3 khối khóa học theo danh mục
  get("/api/category?limit=100", "category");
  get("/api/teacher?limit=8", "teacher");
  for (let i = 0; i < 3; i++) get(`/api/course?categoryId=${data.categoryIds[i % data.categoryIds.length]}&limit=6`, "course_by_category");
  sleep(Math.random() + 0.5);
  // Duyệt: danh sách, tìm kiếm, xem chi tiết
  get("/api/course?limit=12", "course_list");
  if (Math.random() < 0.3) get("/api/course?q=l%E1%BA%ADp&limit=12", "course_search");
  get(`/api/course/${pick(data.courseIds)}`, "course_detail");
  sleep(Math.random() + 0.5);
}
