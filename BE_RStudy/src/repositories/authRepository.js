const prisma = require("../config/database");

// Chọn field an toàn — KHÔNG bao giờ lấy passwordHash ra ngoài
const ACCOUNT_SAFE_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  avatarUrl: true,
  role: true,
  status: true,
  createdAt: true,
  student: true,
  teacher: true,
  administrator: true,
};

const findByEmail = (email) => prisma.account.findUnique({ where: { email } });

const findByIdSafe = (id) => prisma.account.findUnique({ where: { id }, select: ACCOUNT_SAFE_SELECT });

const createStudentAccount = (data) =>
  prisma.account.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      phoneNumber: data.phoneNumber,
      role: "STUDENT",
      student: {
        create: {
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
        },
      },
    },
    select: ACCOUNT_SAFE_SELECT,
  });

const createTeacherAccount = (data) =>
  prisma.account.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      phoneNumber: data.phoneNumber,
      role: "TEACHER",
      teacher: {
        create: {
          specialization: data.specialization,
          biography: data.biography,
          teachingExperience: data.teachingExperience,
        },
      },
    },
    select: ACCOUNT_SAFE_SELECT,
  });

module.exports = { findByEmail, findByIdSafe, createStudentAccount, createTeacherAccount };
