-- AlterEnum
ALTER TYPE "RegistrationStatus" ADD VALUE 'DA_HUY';

-- DropIndex
DROP INDEX "CourseRegistration_studentId_courseId_key";

-- CreateIndex
CREATE INDEX "CourseRegistration_studentId_courseId_idx" ON "CourseRegistration"("studentId", "courseId");
