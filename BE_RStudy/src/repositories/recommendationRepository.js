const prisma = require("../config/database");

const courseSelect = {
    id: true,
    courseName: true,
    description: true,
    price: true,
    coverImageUrl: true,
    category: { select: { id: true, categoryName: true } },
    teacher: { select: { id: true, specialization: true, account: { select: { fullName: true } } } },
};

const openWhere = (maxPrice) => ({
    status: "DANG_MO",
    ...(maxPrice != null && { price: { lte: maxPrice } }),
});

// Khóa đang mở khớp từ khóa (tên, mô tả, danh mục), trong ngân sách nếu có
const findCandidates = ({ keywords, maxPrice, limit }) =>
    prisma.course.findMany({
        where: {
            ...openWhere(maxPrice),
            OR: keywords.flatMap((keyword) => [
                { courseName: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
                { category: { categoryName: { contains: keyword, mode: "insensitive" } } },
            ]),
        },
        take: limit,
        orderBy: { registrations: { _count: "desc" } },
        select: courseSelect,
    });

// Dự phòng khi không khớp từ khóa nào: lấy các khóa đang mở được đăng ký nhiều nhất trong ngân sách
const findOpenCourses = ({ maxPrice, limit }) =>
    prisma.course.findMany({
        where: openWhere(maxPrice),
        take: limit,
        orderBy: { registrations: { _count: "desc" } },
        select: courseSelect,
    });

module.exports = { courseSelect, findCandidates, findOpenCourses };