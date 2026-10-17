-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('HOAT_DONG', 'BI_KHOA', 'CHO_XAC_MINH');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('NAM', 'NU', 'KHAC', 'KHONG_TIET_LO');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI');

-- CreateEnum
CREATE TYPE "FunctionStatus" AS ENUM ('HOAT_DONG', 'NGUNG_HOAT_DONG');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('HOAT_DONG', 'AN');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('BAN_NHAP', 'CHO_DUYET', 'DA_PHE_DUYET', 'DANG_MO', 'TAM_NGUNG', 'DA_KET_THUC');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('CHO_THANH_TOAN', 'DA_THANH_TOAN', 'DA_HUY', 'HOAN_THANH', 'HOAN_TIEN');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('HOAT_DONG', 'TAM_NGUNG', 'HET_HAN');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TIEN_MAT', 'CHUYEN_KHOAN', 'THE', 'VI_DIEN_TU', 'CONG_THANH_TOAN_KHAC');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('CHO_THANH_TOAN', 'DA_THANH_TOAN', 'THAT_BAI', 'DA_HUY', 'HOAN_TIEN');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('CHO_DUYET', 'HIEN_THI', 'AN', 'VI_PHAM');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('HIEN_THI', 'AN', 'VI_PHAM');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('BAN_NHAP', 'DA_PHE_DUYET', 'DANG_MO', 'TAM_NGUNG');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('DANG_LAM', 'DA_NOP', 'DA_CHAM', 'HUY');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('STUDENT', 'AI');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('CHO_XU_LY', 'DANG_XU_LY', 'DA_XU_LY', 'TU_CHOI');

-- CreateTable
CREATE TABLE "Account" (
    "id" VARCHAR(36) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(15),
    "avatarUrl" VARCHAR(2048),
    "role" "Role" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'CHO_XAC_MINH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" VARCHAR(36) NOT NULL,
    "dateOfBirth" DATE,
    "gender" "Gender",
    "address" VARCHAR(255),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" VARCHAR(36) NOT NULL,
    "specialization" VARCHAR(150) NOT NULL,
    "biography" TEXT NOT NULL,
    "teachingExperience" TEXT NOT NULL,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'CHO_DUYET',
    "accountId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrator" (
    "id" VARCHAR(36) NOT NULL,
    "accountId" VARCHAR(36) NOT NULL,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemFunction" (
    "id" VARCHAR(36) NOT NULL,
    "functionName" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "status" "FunctionStatus" NOT NULL DEFAULT 'HOAT_DONG',

    CONSTRAINT "SystemFunction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionAssignment" (
    "id" VARCHAR(36) NOT NULL,
    "administratorId" VARCHAR(36) NOT NULL,
    "functionId" VARCHAR(36) NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermissionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" VARCHAR(36) NOT NULL,
    "categoryName" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "status" "CategoryStatus" NOT NULL DEFAULT 'HOAT_DONG',

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" VARCHAR(36) NOT NULL,
    "courseName" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "coverImageUrl" VARCHAR(2048),
    "status" "CourseStatus" NOT NULL DEFAULT 'BAN_NHAP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "educationLevel" VARCHAR(100),
    "categoryId" VARCHAR(36) NOT NULL,
    "teacherId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" VARCHAR(36) NOT NULL,
    "resourceName" VARCHAR(200) NOT NULL,
    "fileUrl" VARCHAR(2048) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedByTeacherId" VARCHAR(36) NOT NULL,
    "categoryId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRegistration" (
    "id" VARCHAR(36) NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'CHO_THANH_TOAN',
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "studentId" VARCHAR(36) NOT NULL,
    "courseId" VARCHAR(36) NOT NULL,

    CONSTRAINT "CourseRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCode" (
    "id" VARCHAR(36) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "discountAmount" DECIMAL(12,2),
    "discountPercentage" DECIMAL(5,2),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "usageLimit" INTEGER NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "status" "DiscountStatus" NOT NULL DEFAULT 'HOAT_DONG',

    CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" VARCHAR(36) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discountAmountApplied" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'CHO_THANH_TOAN',
    "paidAt" TIMESTAMP(3),
    "studentId" VARCHAR(36) NOT NULL,
    "registrationId" VARCHAR(36) NOT NULL,
    "discountCodeId" VARCHAR(36),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" VARCHAR(36) NOT NULL,
    "rating" SMALLINT NOT NULL,
    "content" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReviewStatus" NOT NULL DEFAULT 'CHO_DUYET',
    "studentId" VARCHAR(36) NOT NULL,
    "courseId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" VARCHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "commentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ContentStatus" NOT NULL DEFAULT 'HIEN_THI',
    "commenterAccountId" VARCHAR(36) NOT NULL,
    "courseId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" VARCHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "repliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ContentStatus" NOT NULL DEFAULT 'HIEN_THI',
    "commentId" VARCHAR(36) NOT NULL,
    "replierAccountId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewResponse" (
    "id" VARCHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ContentStatus" NOT NULL DEFAULT 'HIEN_THI',
    "reviewId" VARCHAR(36) NOT NULL,
    "accountId" VARCHAR(36) NOT NULL,

    CONSTRAINT "ReviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" VARCHAR(36) NOT NULL,
    "examName" VARCHAR(200) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "passingScore" DECIMAL(5,2) NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'BAN_NHAP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" VARCHAR(36) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" VARCHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "questionOrder" INTEGER NOT NULL,
    "examId" VARCHAR(36) NOT NULL,

    CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerOption" (
    "id" VARCHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" VARCHAR(36) NOT NULL,

    CONSTRAINT "AnswerOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" VARCHAR(36) NOT NULL,
    "score" DECIMAL(5,2),
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "AttemptStatus" NOT NULL DEFAULT 'DANG_LAM',
    "studentId" VARCHAR(36) NOT NULL,
    "examId" VARCHAR(36) NOT NULL,

    CONSTRAINT "ExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAttemptDetail" (
    "id" VARCHAR(36) NOT NULL,
    "attemptId" VARCHAR(36) NOT NULL,
    "questionId" VARCHAR(36) NOT NULL,
    "answerOptionId" VARCHAR(36),

    CONSTRAINT "ExamAttemptDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" VARCHAR(36) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "studentId" VARCHAR(36) NOT NULL,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" VARCHAR(36) NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" VARCHAR(36) NOT NULL,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRecommendation" (
    "id" VARCHAR(36) NOT NULL,
    "recommendationReason" TEXT,
    "messageId" VARCHAR(36) NOT NULL,
    "courseId" VARCHAR(36) NOT NULL,

    CONSTRAINT "CourseRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViolationReport" (
    "id" VARCHAR(36) NOT NULL,
    "content" TEXT NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReportStatus" NOT NULL DEFAULT 'CHO_XU_LY',
    "resolutionResult" TEXT,
    "reporterAccountId" VARCHAR(36) NOT NULL,
    "reportedAccountId" VARCHAR(36),
    "reviewId" VARCHAR(36),
    "commentId" VARCHAR(36),
    "replyId" VARCHAR(36),

    CONSTRAINT "ViolationReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_accountId_key" ON "Student"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_accountId_key" ON "Teacher"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_accountId_key" ON "Administrator"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemFunction_functionName_key" ON "SystemFunction"("functionName");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionAssignment_administratorId_functionId_key" ON "PermissionAssignment"("administratorId", "functionId");

-- CreateIndex
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");

-- CreateIndex
CREATE INDEX "Course_teacherId_idx" ON "Course"("teacherId");

-- CreateIndex
CREATE INDEX "Course_status_idx" ON "Course"("status");

-- CreateIndex
CREATE INDEX "CourseRegistration_courseId_idx" ON "CourseRegistration"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");

-- CreateIndex
CREATE INDEX "Invoice_registrationId_idx" ON "Invoice"("registrationId");

-- CreateIndex
CREATE INDEX "Review_courseId_idx" ON "Review"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_studentId_courseId_key" ON "Review"("studentId", "courseId");

-- CreateIndex
CREATE INDEX "Comment_courseId_idx" ON "Comment"("courseId");

-- CreateIndex
CREATE INDEX "Exam_courseId_idx" ON "Exam"("courseId");

-- CreateIndex
CREATE INDEX "ExamQuestion_examId_idx" ON "ExamQuestion"("examId");

-- CreateIndex
CREATE INDEX "AnswerOption_questionId_idx" ON "AnswerOption"("questionId");

-- CreateIndex
CREATE INDEX "ExamAttempt_studentId_examId_idx" ON "ExamAttempt"("studentId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAttemptDetail_attemptId_questionId_key" ON "ExamAttemptDetail"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionAssignment" ADD CONSTRAINT "PermissionAssignment_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "Administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionAssignment" ADD CONSTRAINT "PermissionAssignment_functionId_fkey" FOREIGN KEY ("functionId") REFERENCES "SystemFunction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_uploadedByTeacherId_fkey" FOREIGN KEY ("uploadedByTeacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRegistration" ADD CONSTRAINT "CourseRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRegistration" ADD CONSTRAINT "CourseRegistration_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "CourseRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commenterAccountId_fkey" FOREIGN KEY ("commenterAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_replierAccountId_fkey" FOREIGN KEY ("replierAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerOption" ADD CONSTRAINT "AnswerOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttemptDetail" ADD CONSTRAINT "ExamAttemptDetail_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttemptDetail" ADD CONSTRAINT "ExamAttemptDetail_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttemptDetail" ADD CONSTRAINT "ExamAttemptDetail_answerOptionId_fkey" FOREIGN KEY ("answerOptionId") REFERENCES "AnswerOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRecommendation" ADD CONSTRAINT "CourseRecommendation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AiMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRecommendation" ADD CONSTRAINT "CourseRecommendation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolationReport" ADD CONSTRAINT "ViolationReport_reporterAccountId_fkey" FOREIGN KEY ("reporterAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolationReport" ADD CONSTRAINT "ViolationReport_reportedAccountId_fkey" FOREIGN KEY ("reportedAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolationReport" ADD CONSTRAINT "ViolationReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolationReport" ADD CONSTRAINT "ViolationReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViolationReport" ADD CONSTRAINT "ViolationReport_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
