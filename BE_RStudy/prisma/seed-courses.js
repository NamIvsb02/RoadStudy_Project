require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/hash");

const prisma = new PrismaClient();
const DAY = 24 * 60 * 60 * 1000;

const TEACHERS = [
  {
    email: "gv1@roadstudy.vn",
    fullName: "Nguyễn Minh Khoa",
    specialization: "Lập trình Web và Mobile",
    biography: "Kỹ sư phần mềm với hơn 8 năm làm việc tại các công ty công nghệ.",
    teachingExperience: "6 năm giảng dạy lập trình",
  },
  {
    email: "gv2@roadstudy.vn",
    fullName: "Trần Thu Hà",
    specialization: "Trí tuệ nhân tạo và Dữ liệu",
    biography: "Thạc sĩ Khoa học máy tính, nghiên cứu về học máy và phân tích dữ liệu.",
    teachingExperience: "5 năm giảng dạy AI và dữ liệu",
  },
  {
    email: "gv3@roadstudy.vn",
    fullName: "Lê Quốc Bảo",
    specialization: "Thiết kế đồ họa",
    biography: "Nhà thiết kế tự do, từng làm việc cho nhiều thương hiệu lớn.",
    teachingExperience: "7 năm giảng dạy thiết kế",
  },
  {
    email: "gv4@roadstudy.vn",
    fullName: "Phạm Ngọc Lan",
    specialization: "Tiếng Anh và Kỹ năng mềm",
    biography: "Giảng viên tiếng Anh, chứng chỉ IELTS 8.0.",
    teachingExperience: "9 năm giảng dạy tiếng Anh",
  },
  {
    email: "gv5@roadstudy.vn",
    fullName: "Võ Hoàng Long",
    specialization: "Kinh doanh và Marketing",
    biography: "Chuyên gia marketing, từng quản lý ngân sách quảng cáo hàng tỷ đồng.",
    teachingExperience: "6 năm giảng dạy marketing",
  },
];

const CATEGORIES = [
  {
    name: "Lập trình Web",
    description: "Các khóa học về lập trình web",
    teacher: 0,
    courses: [
      ["HTML, CSS và JavaScript từ con số 0", 399000],
      ["React nâng cao: hooks và quản lý state", 799000],
      ["Node.js và Express xây dựng REST API", 699000],
      ["Next.js xây dựng website thực chiến", 899000],
    ],
  },
  {
    name: "Lập trình Mobile",
    description: "Phát triển ứng dụng di động",
    teacher: 0,
    courses: [
      ["Flutter cơ bản cho người mới", 599000],
      ["React Native thực chiến", 749000],
      ["Kotlin cho Android", 649000],
      ["Swift và SwiftUI cho iOS", 799000, "CHO_DUYET"],
    ],
  },
  {
    name: "Trí tuệ nhân tạo",
    description: "Học máy, học sâu và ứng dụng AI",
    teacher: 1,
    courses: [
      ["Python cho trí tuệ nhân tạo", 499000],
      ["Machine Learning cơ bản", 899000],
      ["Deep Learning với Keras", 1199000],
      ["Xử lý ngôn ngữ tự nhiên", 1299000, "BAN_NHAP"],
    ],
  },
  {
    name: "Khoa học dữ liệu",
    description: "Phân tích và trực quan hóa dữ liệu",
    teacher: 1,
    courses: [
      ["SQL từ cơ bản đến nâng cao", 449000],
      ["Phân tích dữ liệu với Pandas", 549000],
      ["Trực quan hóa dữ liệu với Power BI", 649000],
      ["Thống kê ứng dụng", 399000, "TAM_NGUNG"],
    ],
  },
  {
    name: "Thiết kế đồ họa",
    description: "Thiết kế hình ảnh và giao diện",
    teacher: 2,
    courses: [
      ["Photoshop cho người mới bắt đầu", 349000],
      ["Illustrator và thiết kế logo", 449000],
      ["Thiết kế UI/UX với Figma", 599000],
      ["Dựng video với Premiere Pro", 549000],
    ],
  },
  {
    name: "Tiếng Anh",
    description: "Giao tiếp và luyện thi tiếng Anh",
    teacher: 3,
    courses: [
      ["Tiếng Anh giao tiếp cơ bản", 299000],
      ["Luyện thi IELTS 6.5+", 1490000],
      ["Tiếng Anh thương mại", 699000],
      ["Luyện nghe nói phản xạ", 399000, "DA_KET_THUC"],
    ],
  },
  {
    name: "Marketing",
    description: "Marketing số và truyền thông",
    teacher: 4,
    courses: [
      ["Digital Marketing căn bản", 499000],
      ["Quảng cáo Facebook Ads", 649000],
      ["SEO website lên top Google", 549000],
      ["Content Marketing hiệu quả", 449000],
    ],
  },
  {
    name: "Kinh doanh",
    description: "Khởi nghiệp và quản trị kinh doanh",
    teacher: 4,
    courses: [
      ["Khởi nghiệp tinh gọn", 599000],
      ["Quản lý dự án chuyên nghiệp", 699000],
      ["Kế toán cho người không chuyên", 349000],
      ["Kỹ năng bán hàng", 399000],
    ],
  },
  {
    name: "Kỹ năng mềm",
    description: "Kỹ năng làm việc và phát triển bản thân",
    teacher: 3,
    courses: [
      ["Kỹ năng thuyết trình", 299000],
      ["Quản lý thời gian hiệu quả", 249000],
      ["Tư duy phản biện", 349000],
      ["Giao tiếp nơi công sở", 299000],
    ],
  },
];

const getDates = (status, index) => {
  if (status === "DA_KET_THUC") return { startDate: new Date("2026-03-01"), endDate: new Date("2026-06-30") };
  const start = Date.UTC(2026, 10, 15 + (index % 20));
  return { startDate: new Date(start), endDate: new Date(start + 60 * DAY) };
};

async function main() {
  const passwordHash = await hashPassword("Password123!");

  const teachers = [];
  for (const item of TEACHERS) {
    const account = await prisma.account.upsert({
      where: { email: item.email },
      update: {},
      create: {
        fullName: item.fullName,
        email: item.email,
        passwordHash,
        role: "TEACHER",
        status: "HOAT_DONG",
        teacher: {
          create: {
            specialization: item.specialization,
            biography: item.biography,
            teachingExperience: item.teachingExperience,
            approvalStatus: "DA_DUYET",
          },
        },
      },
      include: { teacher: true },
    });
    teachers.push(account.teacher);
  }

  let createdCategories = 0;
  let createdCourses = 0;
  let index = 0;

  for (const item of CATEGORIES) {
    let category = await prisma.category.findFirst({ where: { categoryName: item.name } });
    if (!category) {
      category = await prisma.category.create({ data: { categoryName: item.name, description: item.description } });
      createdCategories += 1;
    }

    for (const [courseName, price, status = "DANG_MO"] of item.courses) {
      index += 1;
      const exists = await prisma.course.findFirst({ where: { courseName } });
      if (exists) continue;
      await prisma.course.create({
        data: {
          courseName,
          description: `${courseName}: khóa học thực hành có bài tập và dự án cuối khóa, phù hợp cho người mới bắt đầu.`,
          price,
          status,
          ...getDates(status, index),
          categoryId: category.id,
          teacherId: teachers[item.teacher].id,
        },
      });
      createdCourses += 1;
    }
  }

  console.log(`Giáo viên: ${teachers.length} (gv1 đến gv5@roadstudy.vn / Password123!)`);
  console.log(`Danh mục mới: ${createdCategories}, khóa học mới: ${createdCourses}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
