/*
  Warnings:

  - You are about to drop the column `educationLevel` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,courseId]` on the table `CourseRegistration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CourseRegistration_courseId_idx";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "educationLevel";

-- CreateIndex
CREATE UNIQUE INDEX "CourseRegistration_studentId_courseId_key" ON "CourseRegistration"("studentId", "courseId");
