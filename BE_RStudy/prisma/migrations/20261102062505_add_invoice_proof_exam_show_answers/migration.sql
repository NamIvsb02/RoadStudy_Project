-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "showAnswers" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentProofUrl" VARCHAR(2048),
ADD COLUMN     "rejectionReason" VARCHAR(500);
