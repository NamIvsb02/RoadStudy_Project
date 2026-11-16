require("dotenv").config();
const prisma = require("../src/config/database");
const { signAccessToken } = require("../src/utils/jwt");

const API = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`;
const PERMISSION = "QUAN_LY_TAI_KHOAN";
const MISSING_ID = "00000000-0000-4000-8000-000000000000";

let passed = 0;
let failed = 0;

const call = async (method, path, { sub, role, body } = {}) => {
  const token = role ? signAccessToken({ sub, role }) : null;
  const res = await fetch(API + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch (_) {}
  return { status: res.status, json };
};

const check = (name, condition, detail = "") => {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail ? `  -> ${detail}` : ""}`);
  }
};

// Gọi cả hai API quản lý tài khoản. PATCH dùng id không tồn tại: nếu qua được phân quyền
// thì trả 404/400 (nghiệp vụ), không hề đổi dữ liệu thật.
const callBoth = async (actor) => ({
  list: await call("GET", "/account", actor),
  status: await call("PATCH", `/account/${MISSING_ID}/status`, { ...actor, body: { status: "HOAT_DONG" } }),
});

const expectBlocked = (label, r, code) => {
  check(`${label}: GET /account -> ${code}`, r.list.status === code, `status ${r.list.status}`);
  check(`${label}: PATCH /account/:id/status -> ${code}`, r.status.status === code, `status ${r.status.status}`);
};

const expectAllowed = (label, r) => {
  check(`${label}: GET /account -> 200`, r.list.status === 200, `status ${r.list.status}`);
  check(`${label}: PATCH qua phân quyền (không 401/403)`, ![401, 403].includes(r.status.status), `status ${r.status.status}`);
};

async function main() {
  console.log(`Kiểm tra phân quyền ${PERMISSION} tại ${API}\n`);

  const leader = await prisma.administrator.findFirst({ where: { isLeader: true }, select: { accountId: true } });
  const admin = await prisma.administrator.findFirst({
    where: { isLeader: false, permissions: { some: { function: { functionName: PERMISSION } } } },
    select: {
      id: true,
      accountId: true,
      permissions: { where: { function: { functionName: PERMISSION } }, select: { functionId: true } },
    },
  });
  if (!leader || !admin) {
    console.log("Cần có sẵn 1 Leader và 1 admin thường đang được cấp quyền QUAN_LY_TAI_KHOAN (admin@roadstudy.vn trong seed).");
    process.exit(1);
  }
  const asAdmin = { sub: admin.accountId, role: "ADMINISTRATOR" };

  console.log("[Chưa đăng nhập]");
  expectBlocked("Không token", await callBoth({}), 401);

  console.log("\n[Sai vai trò]");
  expectBlocked("STUDENT", await callBoth({ sub: "test-student", role: "STUDENT" }), 403);
  expectBlocked("TEACHER", await callBoth({ sub: "test-teacher", role: "TEACHER" }), 403);

  console.log("\n[Có quyền]");
  expectAllowed("Admin có quyền", await callBoth(asAdmin));
  expectAllowed("Leader", await callBoth({ sub: leader.accountId, role: "ADMINISTRATOR" }));

  console.log("\n[Thu quyền có hiệu lực ngay, dùng cùng token]");
  const functionId = admin.permissions[0].functionId;
  try {
    await prisma.administrator.update({ where: { id: admin.id }, data: { permissions: { deleteMany: { functionId } } } });
    expectBlocked("Admin bị thu quyền", await callBoth(asAdmin), 403);
  } finally {
    await prisma.administrator.update({ where: { id: admin.id }, data: { permissions: { create: { functionId } } } });
    console.log("  (đã khôi phục quyền cho admin)");
  }
  expectAllowed("Admin sau khi khôi phục quyền", await callBoth(asAdmin));

  console.log(`\nKết quả: ${passed} đạt, ${failed} lỗi`);
  await prisma.$disconnect();
  process.exit(failed ? 1 : 0);
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
