// Sinh tài liệu OpenAPI 3.1 cho Swagger UI từ ba nguồn có sẵn, không có bản sao nào để lệch:
//  1. Route thật: đọc router trong src/routes (<module>Routes.js mount ở /api/<module>, theo quy ước trong app.js).
//  2. Schema: body/params lấy từ validate(schema) gắn trên route (zod -> JSON Schema bằng z.toJSONSchema).
//     Vai trò, quyền admin, upload, rate limit lấy từ middleware (thuộc tính apiDoc hoặc so khớp hàm).
//  3. Mô tả: mục "### METHOD /đường-dẫn" trong docs/api-spec.md (nguồn chuẩn về nghiệp vụ, lỗi, ví dụ response).
// Thêm API mới: viết route + mục trong api-spec.md như cũ, Swagger tự có. tests/swagger.test.js báo lỗi nếu hai bên lệch nhau.
const fs = require("fs");
const path = require("path");
const { z } = require("zod");
const { authenticate, optionalAuthenticate } = require("../middlewares/authMiddleware");
const { requireAdmin, requireLeader } = require("../middlewares/permissionMiddleware");
const limiters = require("../middlewares/rateLimitMiddleware");
const { version } = require("../../package.json");

const ROUTES_DIR = path.join(__dirname, "..", "routes");
const SPEC_FILE = path.join(__dirname, "..", "..", "docs", "api-spec.md");
const LIMITERS = new Set(Object.values(limiters));
const METHODS = ["get", "post", "put", "patch", "delete"];

// 1. Route thật
const listRoutes = () => {
  const routes = [];
  for (const file of fs.readdirSync(ROUTES_DIR).filter((f) => f.endsWith("Routes.js")).sort()) {
    const moduleName = file.replace(/Routes\.js$/, "");
    const router = require(path.join(ROUTES_DIR, file));
    const shared = []; // middleware gắn bằng router.use(...), áp dụng cho các route khai báo sau nó
    for (const layer of router.stack) {
      if (!layer.route) {
        shared.push(layer.handle);
        continue;
      }
      const handlers = [...shared, ...layer.route.stack.map((s) => s.handle)];
      for (const method of METHODS.filter((m) => layer.route.methods[m])) {
        const sub = layer.route.path === "/" ? "" : layer.route.path;
        routes.push({ method, module: moduleName, path: `/${moduleName}${sub}`, handlers });
      }
    }
  }
  return routes;
};
const routeKey = (method, p) => `${method.toUpperCase()} ${p.replace(/\/+$/, "") || "/"}`;

// 3. Mô tả từ api-spec.md
const parseSpec = () => {
  const result = { intro: "", modules: {}, endpoints: {} };
  if (!fs.existsSync(SPEC_FILE)) return result; // ví dụ image Docker không chép docs/: Swagger vẫn chạy, chỉ thiếu mô tả
  const lines = fs.readFileSync(SPEC_FILE, "utf8").replace(/\r\n/g, "\n").split("\n");
  let moduleInfo = null; // { name, description } của mục "## N. Tên (`/api/x`)"
  let endpoint = null; // { key, lines }
  let intro = false;
  const flush = () => {
    if (endpoint) result.endpoints[endpoint.key] = { ...endpoint, text: endpoint.lines.join("\n").trim() };
    endpoint = null;
  };
  for (const line of lines) {
    const h2 = /^## \d+\.\s+(.+)$/.exec(line);
    const h3 = /^### (GET|POST|PUT|PATCH|DELETE) (\/\S*)\s*$/.exec(line);
    if (h2) {
      flush();
      intro = /Quy ước chung/.test(h2[1]);
      const mount = /\(`\/api\/(\w+)`\)/.exec(h2[1]);
      moduleInfo = mount ? { name: h2[1].replace(/\s*\(`.*$/, "").trim(), description: [] } : null;
      if (mount) result.modules[mount[1]] = moduleInfo;
      continue;
    }
    if (h3) {
      flush();
      endpoint = { key: routeKey(h3[1], h3[2]), module: moduleInfo, lines: [] };
      continue;
    }
    if (/^#{1,3} /.test(line) && endpoint) flush(); // mục ### khác (ví dụ "Lỗi thường gặp") thuộc phần mô tả module
    if (endpoint) endpoint.lines.push(line);
    else if (intro) result.intro += `${line.replace(/^### /, "#### ")}\n`;
    else if (moduleInfo) moduleInfo.description.push(line.replace(/^### /, "#### "));
  }
  flush();
  return result;
};

// "- Query: `page`, `limit`, `status` (`A` | `B`)" hoặc bảng ngay sau "- Query:" -> danh sách tham số query
const parseQuery = (text) => {
  const lines = text.split("\n");
  const at = lines.findIndex((l) => /^- Query:/.test(l));
  if (at < 0) return [];
  const params = [];
  const inline = lines[at].replace(/^- Query:/, "");
  const re = /`(\w+)(?:=([^`]*))?`(?:\s*\(([^)]*)\))?/g;
  let m;
  while ((m = re.exec(inline))) {
    const [, name, fixed, note] = m;
    // Chỉ coi là enum khi ngoặc chỉ gồm các giá trị `A` | `B` (có thể kèm "không bắt buộc"), không phải câu giải thích
    const onlyValues = note && !note.replace(/`[^`]*`|[|,]|không bắt buộc|\s/g, "");
    const values = fixed ? [fixed] : onlyValues ? [...note.matchAll(/`([^`]+)`/g)].map((v) => v[1]) : [];
    params.push({ name, description: note ? note.replace(/`/g, "") : undefined, values });
  }
  if (!params.length) {
    // dạng bảng: cột đầu là tên tham số (có thể nhiều tên cách nhau bởi dấu phẩy)
    for (const row of lines.slice(at + 1)) {
      if (!row.trim()) {
        if (params.length) break;
        continue;
      }
      if (!row.startsWith("|")) break;
      const [names, note] = row.split("|").slice(1).map((c) => c.trim());
      if (!names || /^-+$/.test(names) || names === "Tham số") continue;
      for (const name of names.split(",").map((n) => n.trim()).filter(Boolean)) params.push({ name, description: note, values: [] });
    }
  }
  const seen = new Set();
  return params.filter((p) => !seen.has(p.name) && seen.add(p.name));
};

// 2. Schema và quyền từ middleware
const toJsonSchema = (schema) => {
  try {
    const json = z.toJSONSchema(schema, { io: "input", unrepresentable: "any" });
    delete json.$schema;
    return json;
  } catch {
    return { type: "object" };
  }
};

const inspect = (handlers) => {
  const info = { auth: null, roles: null, permissions: null, leader: false, admin: false, limited: false, body: null, params: null, upload: null };
  for (const h of handlers) {
    if (h === authenticate) info.auth = "required";
    else if (h === optionalAuthenticate) info.auth = info.auth || "optional";
    else if (h === requireLeader) info.leader = true;
    else if (h === requireAdmin) info.admin = true;
    else if (LIMITERS.has(h)) info.limited = true;
    const doc = h.apiDoc;
    if (!doc) continue;
    if (doc.roles) info.roles = doc.roles;
    if (doc.permissions) info.permissions = doc.permissions;
    if (doc.upload) info.upload = doc.upload;
    if (doc.validate?.source === "body") info.body = doc.validate.schema;
    if (doc.validate?.source === "params") info.params = doc.validate.schema;
  }
  return info;
};

const ERROR_TEXT = {
  400: "Dữ liệu sai hoặc vi phạm nghiệp vụ",
  401: "Chưa đăng nhập, token sai hoặc hết hạn",
  403: "Không đủ quyền",
  404: "Không tìm thấy",
  409: "Trùng dữ liệu hoặc xung đột trạng thái",
  429: "Vượt giới hạn tần suất",
  503: "Hệ thống đang bận (có header Retry-After)",
};

const buildOperation = (route, spec) => {
  const info = inspect(route.handlers);
  const text = spec?.text || "";
  const permissionLine = /^- Quyền:\s*(.+)$/m.exec(text)?.[1];
  const access = [
    info.roles && `**Vai trò:** ${info.roles.join(", ")}`,
    info.permissions && `**Quyền admin:** ${info.permissions.join(" hoặc ")} (Leader luôn được)`,
    info.leader && "**Chỉ Leader**",
  ].filter(Boolean);

  const op = {
    tags: [spec?.module?.name || route.module],
    summary: permissionLine ? permissionLine.replace(/`/g, "") : access.join(", ").replace(/\*/g, "") || (info.auth ? "Cần đăng nhập" : "Công khai"),
    description: [access.join(" · "), text || "_Chưa có mô tả trong docs/api-spec.md_"].filter(Boolean).join("\n\n"),
    operationId: `${route.method}_${route.path.replace(/[/:]+/g, "_").replace(/^_|_$/g, "")}`,
    parameters: [],
    responses: {},
  };
  if (info.auth === "required") op.security = [{ bearerAuth: [] }];
  else if (info.auth === "optional") op.security = [{}, { bearerAuth: [] }];
  else op.security = [];

  const paramProps = info.params ? toJsonSchema(info.params).properties || {} : {};
  for (const name of [...route.path.matchAll(/:(\w+)/g)].map((m) => m[1])) {
    op.parameters.push({ name, in: "path", required: true, schema: paramProps[name] || { type: "string" } });
  }
  if (route.method === "get") {
    for (const q of parseQuery(text)) {
      op.parameters.push({ name: q.name, in: "query", required: false, description: q.description, schema: q.values.length ? { type: "string", enum: q.values } : { type: "string" } });
    }
  }

  if (info.upload) {
    const body = info.body ? toJsonSchema(info.body) : { type: "object", properties: {} };
    body.properties = { ...(body.properties || {}), [info.upload.field]: { type: "string", format: "binary", description: `${info.upload.types.join(", ")}, tối đa ${info.upload.maxSizeMB}MB` } };
    body.required = [...new Set([...(body.required || []), info.upload.field])];
    op.requestBody = { required: true, content: { "multipart/form-data": { schema: body } } };
  } else if (info.body) {
    op.requestBody = { required: true, content: { "application/json": { schema: toJsonSchema(info.body) } } };
  }

  const okStatus = /^- 201/m.test(text) ? "201" : "200";
  op.responses[okStatus] = { description: "Thành công (chi tiết `data` xem mô tả)", content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } } };
  const errors = new Set();
  if (info.body || info.params || info.upload) errors.add(400);
  if (info.auth === "required") errors.add(401);
  if (info.roles || info.permissions || info.leader || info.admin) errors.add(403);
  if (info.limited) errors.add(429);
  const errorLine = /^- Lỗi:\s*(.+)$/m.exec(text)?.[1] || "";
  for (const code of errorLine.match(/\b(4\d\d|503)\b/g) || []) errors.add(Number(code));
  for (const code of [...errors].sort()) {
    op.responses[code] = { description: ERROR_TEXT[code] || "Lỗi", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } };
  }
  return op;
};

const moduleOrder = (spec, tagName) => {
  const i = Object.values(spec.modules).findIndex((m) => m.name === tagName);
  return i < 0 ? 999 : i;
};

const buildOpenApi = () => {
  const spec = parseSpec();
  const routes = listRoutes();
  const paths = {};
  const usedTags = new Map();
  for (const route of routes) {
    const entry = spec.endpoints[routeKey(route.method, route.path)];
    const op = buildOperation(route, entry);
    const tag = op.tags[0];
    if (!usedTags.has(tag)) usedTags.set(tag, (spec.modules[route.module]?.description || []).join("\n").trim());
    const p = route.path.replace(/:(\w+)/g, "{$1}");
    (paths[p] ||= {})[route.method] = op;
  }
  return {
    openapi: "3.1.0",
    info: {
      title: "RoadStudy API",
      version,
      description: 'Bấm **Authorize** và dán access token (không cần chữ "Bearer") để thử API cần đăng nhập. Chi tiết ở `docs/api-spec.md`.',
    },
    servers: [{ url: "/api" }],
    // Giữ thứ tự nhóm như trong api-spec.md
    tags: [...usedTags]
      .map(([name]) => ({ name })) // không kèm mô tả nhóm: phần giới thiệu module trong spec quá dài, chỉ làm rối danh sách
      .sort((a, b) => moduleOrder(spec, a.name) - moduleOrder(spec, b.name)),
    paths,
    components: {
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
      schemas: {
        Success: {
          type: "object",
          properties: { success: { type: "boolean", const: true }, message: { type: "string" }, data: {} },
          required: ["success", "message", "data"],
        },
        Error: {
          type: "object",
          properties: { success: { type: "boolean", const: false }, message: { type: "string" }, data: { type: "null" } },
          required: ["success", "message", "data"],
        },
      },
    },
  };
};

module.exports = { buildOpenApi, listRoutes, parseSpec, routeKey };
