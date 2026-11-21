-- CreateTable
CREATE TABLE "CourseLearning" (
    "courseId" VARCHAR(36) NOT NULL,
    "driveUrl" VARCHAR(2048),
    "classUrl" VARCHAR(2048),
    "showExams" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CourseLearning_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" VARCHAR(36) NOT NULL,
    "courseId" VARCHAR(36) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "note" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseSession_courseId_startTime_idx" ON "CourseSession"("courseId", "startTime");

-- AddForeignKey
ALTER TABLE "CourseLearning" ADD CONSTRAINT "CourseLearning_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
