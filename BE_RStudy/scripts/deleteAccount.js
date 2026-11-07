require("dotenv").config();
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();
const models = Prisma.dmmf.datamodel.models;
const PROTECTED_EMAILS = ["leader@roadstudy.vn", "admin@roadstudy.vn", "teacher@roadstudy.vn", "student@roadstudy.vn"];

const delegateOf = (name) => prisma[name.charAt(0).toLowerCase() + name.slice(1)];
const hasId = (model) => model.fields.some((field) => field.name === "id" && field.isId);

const collect = async (modelName, where, plan) => {
  const model = models.find((item) => item.name === modelName);
  const delegate = delegateOf(modelName);

  if (!hasId(model)) {
    const count = await delegate.count({ where });
    if (count > 0) plan.push({ modelName, where, count });
    return;
  }

  const rows = await delegate.findMany({ where, select: { id: true } });
  if (rows.length === 0) return;
  const ids = rows.map((row) => row.id);

  for (const other of models) {
    for (const field of other.fields) {
      const pointsHere = field.kind === "object" && field.type === modelName && field.relationFromFields?.length;
      if (pointsHere) await collect(other.name, { [field.relationFromFields[0]]: { in: ids } }, plan);
    }
  }
  plan.push({ modelName, where: { id: { in: ids } }, count: ids.length });
};

const main = async () => {
  const [keyword, flag] = process.argv.slice(2);
  if (!keyword) throw new Error("Cú pháp: node scripts/deleteAccount.js <email hoặc một phần email> [--yes]");

  const matches = await prisma.account.findMany({
    where: { email: { contains: keyword } },
    select: { id: true, fullName: true, email: true, role: true },
  });
  if (matches.length !== 1) {
    console.log(`Tìm thấy ${matches.length} tài khoản khớp "${keyword}":`);
    matches.forEach((item) => console.log(`  ${item.email} (${item.role})`));
    throw new Error("Cần đúng 1 tài khoản, hãy gõ email đầy đủ hơn.");
  }

  const account = matches[0];
  if (PROTECTED_EMAILS.includes(account.email)) throw new Error(`${account.email} là tài khoản seed, không được xóa.`);

  const plan = [];
  await collect("Account", { id: account.id }, plan);

  console.log(`Tài khoản: ${account.fullName} <${account.email}> (${account.role})`);
  console.log("Sẽ xóa:");
  plan.forEach((step) => console.log(`  ${step.modelName}: ${step.count} dòng`));

  if (flag !== "--yes") {
    console.log("Chưa xóa gì. Chạy lại kèm --yes để xóa thật.");
    return;
  }
  await prisma.$transaction(plan.map((step) => delegateOf(step.modelName).deleteMany({ where: step.where })));
  console.log("Đã xóa xong.");
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
