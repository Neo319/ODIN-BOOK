-- AlterTable
ALTER TABLE "post" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "likedCommentIds" TEXT[],
ADD COLUMN     "likedPostIds" TEXT[];
