const prisma = require("../config/database");

const db = (tx) => tx || prisma;

const studentSelect = { id: true, account: { select: { fullName: true, email: true } } };

const invoiceInclude = {
    registration: {
        select: { id: true, status: true, courseId: true, course: { select: { id: true, courseName: true } } },
    },
    student: { select: studentSelect },
};

const supportInclude = {
    registration: {
        include: { invoices: true, course: { select: { id: true, courseName: true } } },
    },
    student: { select: studentSelect },
};

const findStudentIdByAccountId = async (accountId) => {
    const student = await prisma.student.findUnique({ where: { accountId }, select: { id: true } });
    return student ? student.id : null;
};

// ---------- Hóa đơn ----------
const findInvoiceById = (id, tx) => db(tx).invoice.findUnique({ where: { id }, include: invoiceInclude });

const findInvoices = (where, { skip, take }) =>
    Promise.all([
        prisma.invoice.findMany({ where, skip, take, orderBy: { id: "desc" }, include: invoiceInclude }),
        prisma.invoice.count({ where }),
    ]);

const updateInvoice = (id, data, tx) => db(tx).invoice.update({ where: { id }, data });

// Chỉ cập nhật khi hóa đơn còn đúng trạng thái cũ: tránh duyệt/từ chối trùng khi hai admin thao tác cùng lúc
const updateInvoiceIfStatus = async (tx, id, fromStatus, data) => {
    const r = await tx.invoice.updateMany({ where: { id, status: fromStatus }, data });
    return r.count === 1;
};

const updateRegistration = (tx, id, data) => tx.courseRegistration.update({ where: { id }, data });

// Hủy đơn (chỉ khi đang CHO_THANH_TOAN) và hóa đơn của đơn đó
const cancelRegistrationRecords = async (tx, registrationId, invoiceId) => {
    const r = await tx.courseRegistration.updateMany({
        where: { id: registrationId, status: "CHO_THANH_TOAN" },
        data: { status: "DA_HUY" },
    });
    if (r.count !== 1) return false;
    await tx.invoice.update({ where: { id: invoiceId }, data: { status: "DA_HUY" } });
    return true;
};

// ---------- Yêu cầu hoàn tiền ----------
const countPendingRefundByRegistration = (registrationId, tx) =>
    db(tx).supportRequest.count({
        where: { registrationId, status: { in: ["CHO_XU_LY", "CHO_HOAN_TIEN"] } },
    });

const createSupportRequest = (data) => prisma.supportRequest.create({ data });

const findSupportRequestById = (id, tx) =>
    db(tx).supportRequest.findUnique({ where: { id }, include: supportInclude });

const findSupportRequests = (where, { skip, take }) =>
    Promise.all([
        prisma.supportRequest.findMany({ where, skip, take, orderBy: { createdAt: "desc" }, include: supportInclude }),
        prisma.supportRequest.count({ where }),
    ]);

const updateSupportIfStatus = async (tx, id, fromStatuses, data) => {
    const r = await tx.supportRequest.updateMany({ where: { id, status: { in: fromStatuses } }, data });
    return r.count === 1;
};

module.exports = {
    findStudentIdByAccountId,
    findInvoiceById,
    findInvoices,
    updateInvoice,
    updateInvoiceIfStatus,
    updateRegistration,
    cancelRegistrationRecords,
    countPendingRefundByRegistration,
    createSupportRequest,
    findSupportRequestById,
    findSupportRequests,
    updateSupportIfStatus,
};