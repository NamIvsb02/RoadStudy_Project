const prisma = require("../config/database");

const db = (tx) => tx || prisma;

const PENDING_REFUND = ["CHO_XU_LY", "CHO_HOAN_TIEN"];

const registrationInclude = {
    course: { select: { id: true, courseName: true, coverImageUrl: true, price: true } },
    invoices: true, // mỗi đơn đăng ký chỉ có 1 hóa đơn
};

const findStudentByAccountId = (accountId) =>
    prisma.student.findUnique({ where: { accountId }, select: { id: true, joinedAt: true } });

const findCourseById = (id) =>
    prisma.course.findUnique({ where: { id }, select: { id: true, courseName: true, price: true, status: true } });

// Ghi lại chính giá trị cũ để khóa hàng học viên trong transaction:
// hai lần đăng ký đồng thời của cùng học viên sẽ chạy lần lượt, không tạo trùng đơn.
const lockStudent = (tx, student) =>
    tx.student.updateMany({ where: { id: student.id }, data: { joinedAt: student.joinedAt } });

const findRegistrations = (studentId, courseId, tx) =>
    db(tx).courseRegistration.findMany({
        where: { studentId, courseId },
        include: { invoices: true },
        orderBy: { registeredAt: "desc" },
    });

// Yêu cầu hoàn tiền chưa giải quyết của học viên cho khóa này (chặn đăng ký lại)
const countPendingRefundByCourse = (studentId, courseId, tx) =>
    db(tx).supportRequest.count({
        where: { studentId, status: { in: PENDING_REFUND }, registration: { courseId } },
    });

const countPendingRefundByRegistration = (registrationId, tx) =>
    db(tx).supportRequest.count({ where: { registrationId, status: { in: PENDING_REFUND } } });

const createRegistration = (tx, data) => tx.courseRegistration.create({ data });

const createInvoice = (tx, data) => tx.invoice.create({ data });

const findMine = (where, { skip, take }) =>
    Promise.all([
        prisma.courseRegistration.findMany({
            where,
            skip,
            take,
            orderBy: { registeredAt: "desc" },
            include: registrationInclude,
        }),
        prisma.courseRegistration.count({ where }),
    ]);

const findById = (id, tx) =>
    db(tx).courseRegistration.findUnique({ where: { id }, include: registrationInclude });

module.exports = {
    findStudentByAccountId,
    findCourseById,
    lockStudent,
    findRegistrations,
    countPendingRefundByCourse,
    countPendingRefundByRegistration,
    createRegistration,
    createInvoice,
    findMine,
    findById,
};