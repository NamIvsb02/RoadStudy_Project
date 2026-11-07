const { Prisma } = require("@prisma/client");
const prisma = require("../config/database");
const AppError = require("../utils/AppError");
const repo = require("../repositories/enrollmentRepository");
const couponService = require("./couponService");
const invoiceService = require("./invoiceService");

const { Decimal } = Prisma;
const ACTIVE_STATUSES = ["CHO_THANH_TOAN", "DA_THANH_TOAN", "HOAN_THANH"];
const REGISTRATION_STATUSES = ["CHO_THANH_TOAN", "DA_THANH_TOAN", "HOAN_TIEN", "DA_HUY"];

async function requireStudent(accountId) {
    const student = await repo.findStudentByAccountId(accountId);
    if (!student) throw new AppError("Chỉ học viên mới thực hiện được chức năng này", 403);
    return student;
}

function toDto(registration) {
    const { invoices, ...rest } = registration;
    const invoice = invoices && invoices[0] ? invoiceService.toInvoiceDto(invoices[0]) : null;
    return { ...rest, invoice };
}

// Đăng ký khóa học: đơn + hóa đơn + tăng usedCount nằm trong cùng 1 transaction
async function create(accountId, { courseId, discountCode }) {
    const student = await requireStudent(accountId);

    const course = await repo.findCourseById(courseId);
    if (!course || course.status !== "DANG_MO") {
        throw new AppError("Khóa học không tồn tại hoặc chưa mở đăng ký", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
        await repo.lockStudent(tx, student);

        if ((await repo.countPendingRefundByCourse(student.id, courseId, tx)) > 0) {
            throw new AppError("Bạn đang có yêu cầu hoàn tiền chưa được xử lý cho khóa học này", 409);
        }

        const active = (await repo.findRegistrations(student.id, courseId, tx)).find((r) =>
            ACTIVE_STATUSES.includes(r.status)
        );
        if (active) {
            if (active.status !== "CHO_THANH_TOAN") throw new AppError("Bạn đã đăng ký khóa học này", 409);

            const oldInvoice = active.invoices[0];
            if (oldInvoice && oldInvoice.status === "CHO_THANH_TOAN") {
                // Đơn cũ còn chờ thanh toán: trả lại để thanh toán tiếp (không tạo đơn mới)
                return { created: false, registration: active, invoice: oldInvoice };
            }
            // Hóa đơn cũ đã bị từ chối: hủy đơn cũ (trả lượt mã giảm giá) rồi tạo đơn mới
            if (oldInvoice) await invoiceService.cancelRegistrationTx(tx, active, oldInvoice);
        }

        const coupon = discountCode ? await couponService.getUsableCoupon(discountCode, student.id, tx) : null;

        let discountAmountApplied = new Decimal(0);
        let totalAmount = new Decimal(course.price);
        if (coupon) {
            ({ discountAmountApplied, totalAmount } = couponService.calculateDiscount(coupon, course.price));
        }
        const free = totalAmount.isZero(); // khóa miễn phí (hoặc giảm hết): không cần thanh toán

        const registration = await repo.createRegistration(tx, {
            studentId: student.id,
            courseId,
            status: free ? "DA_THANH_TOAN" : "CHO_THANH_TOAN",
        });
        const invoice = await repo.createInvoice(tx, {
            subtotal: course.price,
            discountAmountApplied,
            totalAmount,
            paymentMethod: "CHUYEN_KHOAN",
            status: free ? "DA_THANH_TOAN" : "CHO_THANH_TOAN",
            paidAt: free ? new Date() : null,
            studentId: student.id,
            registrationId: registration.id,
            discountCodeId: coupon ? coupon.id : null,
        });
        if (coupon) await couponService.consumeCoupon(tx, coupon);

        return { created: true, registration, invoice };
    });

    const invoiceDto = invoiceService.toInvoiceDto(result.invoice);
    return {
        created: result.created,
        data: {
            registration: result.registration,
            invoice: invoiceDto,
            paymentInfo: invoiceService.buildPaymentInfo(result.invoice),
        },
    };
}

async function listMine(accountId, query, { skip, take }) {
    const student = await requireStudent(accountId);
    const where = { studentId: student.id };
    if (REGISTRATION_STATUSES.includes(query.status)) where.status = query.status;
    if (query.courseId) where.courseId = String(query.courseId);
    const [rows, total] = await repo.findMine(where, { skip, take });
    return { items: rows.map(toDto), total };
}

async function getMine(accountId, id) {
    const student = await requireStudent(accountId);
    const registration = await repo.findById(id);
    if (!registration || registration.studentId !== student.id) {
        throw new AppError("Đơn đăng ký không tồn tại", 404);
    }
    return {
        ...toDto(registration),
        paymentInfo: registration.invoices[0] ? invoiceService.buildPaymentInfo(registration.invoices[0]) : null,
    };
}

// Hủy đơn khi chưa gửi minh chứng (hoặc hóa đơn đã bị từ chối): hủy trực tiếp, trả lại lượt mã giảm giá
async function cancel(accountId, id) {
    const student = await requireStudent(accountId);

    await prisma.$transaction(async (tx) => {
        await repo.lockStudent(tx, student);
        const registration = await repo.findById(id, tx);
        if (!registration || registration.studentId !== student.id) {
            throw new AppError("Đơn đăng ký không tồn tại", 404);
        }
        if (registration.status !== "CHO_THANH_TOAN") {
            throw new AppError("Chỉ hủy được đơn đang chờ thanh toán", 400);
        }
        if ((await repo.countPendingRefundByRegistration(id, tx)) > 0) {
            throw new AppError("Đơn đang có yêu cầu hoàn tiền chờ xử lý", 409);
        }
        const invoice = registration.invoices[0];
        if (invoice && invoice.status === "CHO_THANH_TOAN" && invoice.paymentProofUrl) {
            throw new AppError(
                "Bạn đã gửi minh chứng thanh toán, hãy gửi yêu cầu hủy kèm hoàn tiền (POST /invoice/:id/refund-request)",
                409
            );
        }
        if (invoice) await invoiceService.cancelRegistrationTx(tx, registration, invoice);
    });
}

module.exports = { create, listMine, getMine, cancel };