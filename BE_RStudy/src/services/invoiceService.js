const fs = require("fs");
const path = require("path");
const { Prisma } = require("@prisma/client");
const prisma = require("../config/database");
const AppError = require("../utils/AppError");
const { sendMail } = require("../config/mail");
const repo = require("../repositories/invoiceRepository");
const couponService = require("./couponService");

const { Decimal } = Prisma;
const UPLOAD_ROOT = path.join(__dirname, "../../uploads");
const PROOF_DIR = path.join(UPLOAD_ROOT, "proofs");
const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;
const INVOICE_STATUSES = ["CHO_THANH_TOAN", "DA_THANH_TOAN", "THAT_BAI", "HOAN_TIEN", "DA_HUY"];
const REFUND_STATUSES = ["CHO_XU_LY", "CHO_HOAN_TIEN", "DA_XU_LY", "TU_CHOI"];

// ---------- Hiển thị ----------
// Ảnh minh chứng là dữ liệu nhạy cảm nên không mở công khai: FE lấy qua API có đăng nhập
function toInvoiceDto(invoice) {
    const { paymentProofUrl, ...rest } = invoice;
    return {
        ...rest,
        hasPaymentProof: Boolean(paymentProofUrl),
        paymentProofUrl: paymentProofUrl ? `/api/invoice/${invoice.id}/proof` : null,
    };
}

const transferContent = (invoice) => `RS${invoice.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

// Thông tin chuyển khoản + link mã QR (VietQR). Cấu hình tài khoản nhận tiền trong .env
function buildPaymentInfo(invoice) {
    if (!["CHO_THANH_TOAN", "THAT_BAI"].includes(invoice.status)) return null;
    const bankId = process.env.PAYMENT_BANK_ID || null;
    const accountNo = process.env.PAYMENT_ACCOUNT_NO || null;
    const accountName = process.env.PAYMENT_ACCOUNT_NAME || null;
    const content = transferContent(invoice);
    const total = new Decimal(invoice.totalAmount);

    const qrUrl =
        bankId && accountNo
            ? `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${total.toFixed(0)}` +
            `&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName || "")}`
            : null;

    return { bankId, accountNo, accountName, amount: total.toFixed(2), transferContent: content, qrUrl };
}

async function notify(email, subject, text) {
    try {
        await sendMail({ to: email, subject, text });
    } catch (err) {
        console.error("Gửi email thất bại:", err.message);
    }
}

const removeFile = (relativePath) => {
    if (!relativePath) return;
    fs.promises.unlink(path.join(UPLOAD_ROOT, relativePath)).catch(() => { });
};

// ---------- Dùng chung với module enrollment ----------
// Hủy đơn + hóa đơn và trả lại lượt mã giảm giá. Gọi TRONG transaction.
async function cancelRegistrationTx(tx, registration, invoice) {
    const ok = await repo.cancelRegistrationRecords(tx, registration.id, invoice.id);
    if (!ok) throw new AppError("Đơn đăng ký đã thay đổi trạng thái, vui lòng thử lại", 409);
    if (invoice.discountCodeId) await couponService.releaseCoupon(tx, invoice.discountCodeId);
}

// ---------- Truy cập ----------
async function loadInvoiceFor(user, id) {
    const invoice = await repo.findInvoiceById(id);
    if (!invoice) throw new AppError("Hóa đơn không tồn tại", 404);
    if (user.role === "STUDENT") {
        const studentId = await repo.findStudentIdByAccountId(user.id);
        if (!studentId || invoice.studentId !== studentId) throw new AppError("Hóa đơn không tồn tại", 404);
    }
    return invoice;
}

async function requireStudentId(accountId) {
    const studentId = await repo.findStudentIdByAccountId(accountId);
    if (!studentId) throw new AppError("Chỉ học viên mới thực hiện được chức năng này", 403);
    return studentId;
}

// ---------- Hóa đơn: học viên ----------
async function listMine(accountId, query, { skip, take }) {
    const studentId = await requireStudentId(accountId);
    const where = { studentId };
    if (INVOICE_STATUSES.includes(query.status)) where.status = query.status;
    const [rows, total] = await repo.findInvoices(where, { skip, take });
    return { items: rows.map(toInvoiceDto), total };
}

async function getById(user, id) {
    const invoice = await loadInvoiceFor(user, id);
    return { ...toInvoiceDto(invoice), paymentInfo: buildPaymentInfo(invoice) };
}

async function uploadProof(accountId, id, file) {
    if (!file) throw new AppError("Vui lòng chọn ảnh minh chứng (trường proof)", 400);
    const newPath = `proofs/${file.filename}`;
    try {
        const invoice = await loadInvoiceFor({ id: accountId, role: "STUDENT" }, id);
        if (!["CHO_THANH_TOAN", "THAT_BAI"].includes(invoice.status) || invoice.registration.status !== "CHO_THANH_TOAN") {
            throw new AppError("Hóa đơn này không thể gửi minh chứng thanh toán", 400);
        }
        if ((await repo.countPendingRefundByRegistration(invoice.registrationId)) > 0) {
            throw new AppError("Đơn đang có yêu cầu hoàn tiền chờ xử lý", 409);
        }
        // Gửi lại sau khi bị từ chối: quay về chờ duyệt, xóa lý do cũ và minh chứng cũ
        const updated = await repo.updateInvoice(id, {
            paymentProofUrl: newPath,
            status: "CHO_THANH_TOAN",
            rejectionReason: null,
        });
        removeFile(invoice.paymentProofUrl);
        return toInvoiceDto(updated);
    } catch (err) {
        removeFile(newPath);
        throw err;
    }
}

async function getProofFile(user, id) {
    const invoice = await loadInvoiceFor(user, id);
    if (!invoice.paymentProofUrl) throw new AppError("Hóa đơn chưa có minh chứng thanh toán", 404);
    const file = path.resolve(UPLOAD_ROOT, invoice.paymentProofUrl);
    if (!file.startsWith(PROOF_DIR + path.sep) || !fs.existsSync(file)) {
        throw new AppError("Tệp minh chứng không còn tồn tại", 404);
    }
    return file;
}

// ---------- Hóa đơn: admin duyệt thanh toán ----------
async function listAll(query, { skip, take }) {
    const where = {};
    if (INVOICE_STATUSES.includes(query.status)) where.status = query.status;
    if (query.pending === "true") {
        where.status = "CHO_THANH_TOAN"; // chờ duyệt: đã có minh chứng
        where.paymentProofUrl = { not: null };
    }
    if (query.q) {
        const q = String(query.q).trim();
        where.student = {
            account: { OR: [{ fullName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] },
        };
    }
    const [rows, total] = await repo.findInvoices(where, { skip, take });
    return { items: rows.map(toInvoiceDto), total };
}

async function loadPendingReview(id) {
    const invoice = await repo.findInvoiceById(id);
    if (!invoice) throw new AppError("Hóa đơn không tồn tại", 404);
    if (invoice.status !== "CHO_THANH_TOAN") throw new AppError("Chỉ xử lý được hóa đơn đang chờ thanh toán", 400);
    if (!invoice.paymentProofUrl) throw new AppError("Học viên chưa gửi minh chứng thanh toán", 400);
    if (invoice.registration.status !== "CHO_THANH_TOAN") throw new AppError("Đơn đăng ký không còn chờ thanh toán", 409);
    if ((await repo.countPendingRefundByRegistration(invoice.registrationId)) > 0) {
        throw new AppError("Đơn đang có yêu cầu hủy/hoàn tiền chờ xử lý", 409);
    }
    return invoice;
}

async function approve(id) {
    const invoice = await loadPendingReview(id);
    await prisma.$transaction(async (tx) => {
        const ok = await repo.updateInvoiceIfStatus(tx, id, "CHO_THANH_TOAN", { status: "DA_THANH_TOAN", paidAt: new Date() });
        if (!ok) throw new AppError("Hóa đơn đã được xử lý bởi người khác", 409);
        await repo.updateRegistration(tx, invoice.registrationId, { status: "DA_THANH_TOAN", amountPaid: invoice.totalAmount });
    });
    await notify(
        invoice.student.account.email,
        "RoadStudy: thanh toán đã được xác nhận",
        `Thanh toán cho khóa học "${invoice.registration.course.courseName}" đã được xác nhận. Bạn có thể bắt đầu học.`
    );
    return toInvoiceDto(await repo.findInvoiceById(id));
}

async function reject(id, reason) {
    const invoice = await loadPendingReview(id);
    const ok = await prisma.$transaction((tx) =>
        repo.updateInvoiceIfStatus(tx, id, "CHO_THANH_TOAN", { status: "THAT_BAI", rejectionReason: reason })
    );
    if (!ok) throw new AppError("Hóa đơn đã được xử lý bởi người khác", 409);
    await notify(
        invoice.student.account.email,
        "RoadStudy: thanh toán bị từ chối",
        `Thanh toán cho khóa học "${invoice.registration.course.courseName}" bị từ chối. Lý do: ${reason}. Bạn có thể gửi lại minh chứng.`
    );
    return toInvoiceDto(await repo.findInvoiceById(id));
}

// ---------- Yêu cầu hoàn tiền: học viên ----------
const toRequestDto = (request) => {
    const { registration, ...rest } = request;
    const { invoices, ...reg } = registration;
    return { ...rest, registration: reg, invoice: invoices[0] ? toInvoiceDto(invoices[0]) : null };
};

async function requestRefund(accountId, invoiceId, description) {
    const studentId = await requireStudentId(accountId);
    const invoice = await repo.findInvoiceById(invoiceId);
    if (!invoice || invoice.studentId !== studentId) throw new AppError("Hóa đơn không tồn tại", 404);

    if ((await repo.countPendingRefundByRegistration(invoice.registrationId)) > 0) {
        throw new AppError("Đã có yêu cầu hoàn tiền đang chờ xử lý cho đơn này", 409);
    }

    const registration = invoice.registration;
    const sentProofUnpaid =
        invoice.status === "CHO_THANH_TOAN" && invoice.paymentProofUrl && registration.status === "CHO_THANH_TOAN";
    const paid = invoice.status === "DA_THANH_TOAN" && registration.status === "DA_THANH_TOAN";

    if (paid) {
        // Hạn 24 giờ tính tại thời điểm học viên gửi yêu cầu
        if (!invoice.paidAt || Date.now() - invoice.paidAt.getTime() > REFUND_WINDOW_MS) {
            throw new AppError("Đã quá 24 giờ kể từ khi thanh toán, không thể yêu cầu hoàn tiền", 400);
        }
    } else if (!sentProofUnpaid) {
        throw new AppError("Hóa đơn này không thể yêu cầu hoàn tiền", 400);
    }

    const request = await repo.createSupportRequest({
        type: "HOAN_TIEN_KHOA_HOC",
        description,
        studentId,
        registrationId: invoice.registrationId,
    });
    return request;
}

async function listMyRefundRequests(accountId, { skip, take }) {
    const studentId = await requireStudentId(accountId);
    const [rows, total] = await repo.findSupportRequests({ studentId }, { skip, take });
    return { items: rows.map(toRequestDto), total };
}

// ---------- Yêu cầu hoàn tiền: admin ----------
async function listRefundRequests(query, { skip, take }) {
    const where = {};
    if (REFUND_STATUSES.includes(query.status)) where.status = query.status;
    const [rows, total] = await repo.findSupportRequests(where, { skip, take });
    return { items: rows.map(toRequestDto), total };
}

async function loadRequest(id) {
    const request = await repo.findSupportRequestById(id);
    if (!request) throw new AppError("Yêu cầu hoàn tiền không tồn tại", 404);
    return request;
}

async function approveRefund(id, adminNote) {
    const request = await loadRequest(id);
    const ok = await prisma.$transaction((tx) =>
        repo.updateSupportIfStatus(tx, id, ["CHO_XU_LY"], {
            status: "CHO_HOAN_TIEN",
            adminNote: adminNote ?? request.adminNote,
            handledAt: new Date(),
        })
    );
    if (!ok) throw new AppError("Chỉ chấp thuận được yêu cầu đang chờ xử lý", 409);
    await notify(
        request.student.account.email,
        "RoadStudy: yêu cầu hoàn tiền được chấp thuận",
        "Yêu cầu hoàn tiền của bạn đã được chấp thuận. Chúng tôi sẽ hoàn tiền và thông báo khi hoàn tất."
    );
    return toRequestDto(await repo.findSupportRequestById(id));
}

// Chỉ gọi khi đã hoàn tiền thực tế: lúc này mới chuyển đăng ký + hóa đơn sang HOAN_TIEN
async function completeRefund(id, adminNote) {
    const request = await loadRequest(id);
    const invoice = request.registration.invoices[0];

    await prisma.$transaction(async (tx) => {
        const ok = await repo.updateSupportIfStatus(tx, id, ["CHO_HOAN_TIEN"], {
            status: "DA_XU_LY",
            adminNote: adminNote ?? request.adminNote,
            handledAt: new Date(),
        });
        if (!ok) throw new AppError("Chỉ hoàn tất được yêu cầu đã chấp thuận (CHO_HOAN_TIEN)", 409);
        await repo.updateRegistration(tx, request.registrationId, { status: "HOAN_TIEN" });
        if (invoice) await repo.updateInvoice(invoice.id, { status: "HOAN_TIEN" }, tx);
    });
    await notify(
        request.student.account.email,
        "RoadStudy: đã hoàn tiền",
        `Khoản thanh toán cho khóa học "${request.registration.course.courseName}" đã được hoàn tiền.`
    );
    return toRequestDto(await repo.findSupportRequestById(id));
}

async function rejectRefund(id, adminNote, cancelRegistration) {
    const request = await loadRequest(id);
    const registration = request.registration;
    const invoice = registration.invoices[0];

    if (cancelRegistration) {
        if (registration.status !== "CHO_THANH_TOAN" || !invoice || invoice.status !== "CHO_THANH_TOAN") {
            throw new AppError("Chỉ hủy được đơn chưa thanh toán", 400);
        }
    }
    await prisma.$transaction(async (tx) => {
        const ok = await repo.updateSupportIfStatus(tx, id, ["CHO_XU_LY"], {
            status: "TU_CHOI",
            adminNote,
            handledAt: new Date(),
        });
        if (!ok) throw new AppError("Chỉ từ chối được yêu cầu đang chờ xử lý", 409);
        if (cancelRegistration) await cancelRegistrationTx(tx, registration, invoice);
    });
    await notify(
        request.student.account.email,
        "RoadStudy: yêu cầu hoàn tiền bị từ chối",
        `Yêu cầu hoàn tiền của bạn bị từ chối. Lý do: ${adminNote}`
    );
    return toRequestDto(await repo.findSupportRequestById(id));
}

module.exports = {
    toInvoiceDto,
    buildPaymentInfo,
    cancelRegistrationTx,
    listMine,
    getById,
    uploadProof,
    getProofFile,
    listAll,
    approve,
    reject,
    requestRefund,
    listMyRefundRequests,
    listRefundRequests,
    approveRefund,
    completeRefund,
    rejectRefund,
};