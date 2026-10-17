/*
  Warnings:

  - The values [DA_HUY] on the enum `RegistrationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegistrationStatus_new" AS ENUM ('CHO_THANH_TOAN', 'DA_THANH_TOAN', 'HOAN_THANH', 'HOAN_TIEN');
ALTER TABLE "public"."CourseRegistration" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "CourseRegistration" ALTER COLUMN "status" TYPE "RegistrationStatus_new" USING ("status"::text::"RegistrationStatus_new");
ALTER TYPE "RegistrationStatus" RENAME TO "RegistrationStatus_old";
ALTER TYPE "RegistrationStatus_new" RENAME TO "RegistrationStatus";
DROP TYPE "public"."RegistrationStatus_old";
ALTER TABLE "CourseRegistration" ALTER COLUMN "status" SET DEFAULT 'CHO_THANH_TOAN';
COMMIT;
