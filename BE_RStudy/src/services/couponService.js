const { Prisma } = require("@prisma/client");
const AppError = require("../utils/AppError");
const repo = require("../repositories/couponRepository");

const { Decimal } = Prisma;
const STATUSES = ["HOAT_DONG", "TAM_NGUNG", "HET_HAN"];
const normalize = (code) => String(code).trim().toUpperCase();

// Ràng buộc chéo giữa các trường (dùng cho cả tạo và sửa)
function assertRules(d) {
    const hasAmount = d.discountAmount != null;
    const hasPercent = d.discountPercentage != null;
    if (hasAmount === hasPercent) {
        throw new AppError("Chỉ được nhập một trong hai: số tiền giảm hoặc phần trăm giảm", 400);
    }
    if (new Date(d.endDate) <= new Date(d.startDate)) {
        throw new AppError("Ngày kết thúc phải sau ngày bắt đầu", 400);
    }
}

// ================= CRUD =================
async function list(query, { skip, take }) {
    const where = {};
    if (STATUSES.includes(query.status)) where.status = query.status;
    if (query.q) where.code = { contains: String(query.q).trim(), mode: "insensitive" };
    const [items, total] = await repo.findMany(where, { skip, take });
    return { items, total };
}

async function getById(id) {
    const coupon = await repo.findById(id);
    if (!coupon) throw new AppError("Mã giảm giá không tồn tại", 404);
    return coupon;
}

async function create(data) {
    const payload = { ...data, code: normalize(data.code) };
    assertRules(payload);
    if (await repo.findByCode(payload.code)) throw new AppError("Mã giảm giá đã tồn tại", 409);
    return repo.create(payload);
}

async function update(id, data) {
    const existing = await getById(id);
    const patch = { ...data };

    if (patch.code !== undefined) {
        patch.code = normalize(patch.code);
        if (patch.code !== existing.code) {
            if (existing.usedCount > 0) throw new AppError("Mã đã được sử dụng, không thể đổi mã", 409);
            if (await repo.findByCode(patch.code)) throw new AppError("Mã giảm giá đã tồn tại", 409);
        }
    }
    // Đổi loại giảm: tự xóa giá trị của loại còn lại
    if (patch.discountAmount != null) patch.discountPercentage = null;
    if (patch.discountPercentage != null) patch.discountAmount = null;

    if (patch.usageLimit !== undefined && patch.usageLimit < existing.usedCount) {
        throw new AppError(`Số lượt tối đa không được nhỏ hơn số lượt đã dùng (${existing.usedCount})`, 400);
    }
    assertRules({ ...existing, ...patch });
    return repo.update(id, patch);
}

async function changeStatus(id, status) {
    await getById(id);
    return repo.update(id, { status });
}

async function remove(id) {
    const coupon = await getById(id);
    if (coupon.usedCount > 0 || (await repo.countInvoices(id)) > 0) {
        throw new AppError("Mã đã được sử dụng, chỉ có thể tạm ngưng, không thể xóa", 409);
    }
    await repo.remove(id);
}

// ================= VALIDATE / ÁP MÃ =================
function getUsabilityError(coupon, now = new Date()) {
    if (coupon.status !== "HOAT_DONG") return "Mã giảm giá đang tạm ngưng hoặc đã hết hạn";
    if (now < coupon.startDate) return "Mã giảm giá chưa có hiệu lực";
    if (now > coupon.endDate) return "Mã giảm giá đã hết hạn";
    if (coupon.usedCount >= coupon.usageLimit) return "Mã giảm giá đã hết lượt sử dụng";
    return null;
}

/**
 * Lấy mã và kiểm tra dùng được: tồn tại, trạng thái, thời hạn, lượt dùng,
 * và (nếu có studentId) học viên chưa dùng mã này.
 * Module enrollment gọi hàm này BÊN TRONG transaction (truyền tx).
 */
async function getUsableCoupon(code, studentId, tx) {
    const coupon = await repo.findByCode(normalize(code), tx);
    if (!coupon) throw new AppError("Mã giảm giá không tồn tại", 404);

    const error = getUsabilityError(coupon);
    if (error) throw new AppError(error, 400);

    if (studentId && (await repo.countStudentUsage(coupon.id, studentId, tx)) > 0) {
        throw new AppError("Bạn đã sử dụng mã giảm giá này rồi", 400);
    }
    return coupon;
}

function calculateDiscount(coupon, subtotal) {
    const price = new Decimal(subtotal);
    const raw =
        coupon.discountPercentage != null
            ? price.mul(coupon.discountPercentage).div(100)
            : new Decimal(coupon.discountAmount);
    // Không giảm quá giá gốc để totalAmount không âm
    const discountAmountApplied = Decimal.min(raw.toDecimalPlaces(2, Decimal.ROUND_DOWN), price);
    return { discountAmountApplied, totalAmount: price.sub(discountAmountApplied) };
}

// Gọi trong prisma.$transaction, cùng lúc tạo đăng ký + hóa đơn
async function consumeCoupon(tx, coupon) {
    const ok = await repo.incrementUsedCount(coupon.id, coupon.usageLimit, tx);
    if (!ok) throw new AppError("Mã giảm giá đã hết lượt sử dụng", 400);
}

// API xem trước giá khi học viên nhập mã (chưa tăng usedCount)
async function validateCoupon({ code, courseId }, accountId) {
    const studentId = await repo.findStudentIdByAccountId(accountId); // admin test: null -> bỏ qua kiểm tra theo học viên
    const coupon = await getUsableCoupon(code, studentId);

    const result = {
        discountCodeId: coupon.id,
        code: coupon.code,
        discountType: coupon.discountPercentage != null ? "PERCENTAGE" : "AMOUNT",
        discountValue: String(coupon.discountPercentage ?? coupon.discountAmount),
    };
    if (!courseId) return result;

    const course = await repo.findCourseById(courseId);
    if (!course) throw new AppError("Khóa học không tồn tại", 404);
    const { discountAmountApplied, totalAmount } = calculateDiscount(coupon, course.price);
    return {
        ...result,
        subtotal: new Decimal(course.price).toFixed(2),
        discountAmountApplied: discountAmountApplied.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
    };
}

module.exports = {
    list,
    getById,
    create,
    update,
    changeStatus,
    remove,
    validateCoupon,
    getUsableCoupon,
    calculateDiscount,
    consumeCoupon,
};
