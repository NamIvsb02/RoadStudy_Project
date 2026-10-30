const prisma = require("../config/database");

const db = (tx) => tx || prisma;

// Hóa đơn thất bại/đã hủy thì học viên được dùng lại mã; HOAN_TIEN vẫn tính là đã dùng
const RELEASED_INVOICE_STATUSES = ["THAT_BAI", "DA_HUY"];

const findMany = (where, { skip, take }) =>
    Promise.all([
        prisma.discountCode.findMany({ where, skip, take, orderBy: { startDate: "desc" } }),
        prisma.discountCode.count({ where }),
    ]);

const findById = (id, tx) => db(tx).discountCode.findUnique({ where: { id } });

const findByCode = (code, tx) => db(tx).discountCode.findUnique({ where: { code } });

const create = (data) => prisma.discountCode.create({ data });

const update = (id, data) => prisma.discountCode.update({ where: { id }, data });

const remove = (id) => prisma.discountCode.delete({ where: { id } });

const countInvoices = (discountCodeId) => prisma.invoice.count({ where: { discountCodeId } });

// Số hóa đơn "đang giữ" mã này của học viên (không tính THAT_BAI, DA_HUY)
const countStudentUsage = (discountCodeId, studentId, tx) =>
    db(tx).invoice.count({
        where: { discountCodeId, studentId, status: { notIn: RELEASED_INVOICE_STATUSES } },
    });

const findStudentIdByAccountId = async (accountId) => {
    const student = await prisma.student.findUnique({ where: { accountId }, select: { id: true } });
    return student ? student.id : null;
};

const findCourseById = (id) =>
    prisma.course.findUnique({ where: { id }, select: { id: true, price: true } });

// Tăng usedCount nguyên tử: chỉ thành công khi usedCount < usageLimit tại thời điểm update,
// nên hai request đồng thời không thể cùng vượt giới hạn.
const incrementUsedCount = async (id, usageLimit, tx) => {
    const result = await db(tx).discountCode.updateMany({
        where: { id, usedCount: { lt: usageLimit } },
        data: { usedCount: { increment: 1 } },
    });
    return result.count === 1;
};

module.exports = {
    findMany,
    findById,
    findByCode,
    create,
    update,
    remove,
    countInvoices,
    countStudentUsage,
    findStudentIdByAccountId,
    findCourseById,
    incrementUsedCount,
};
