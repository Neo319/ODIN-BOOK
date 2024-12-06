/*
  Warnings:

  - You are about to drop the `_Userfollows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Userfollows" DROP CONSTRAINT "_Userfollows_A_fkey";

-- DropForeignKey
ALTER TABLE "_Userfollows" DROP CONSTRAINT "_Userfollows_B_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "followedByIds" TEXT[],
ADD COLUMN     "followingIds" TEXT[];

-- DropTable
DROP TABLE "_Userfollows";
