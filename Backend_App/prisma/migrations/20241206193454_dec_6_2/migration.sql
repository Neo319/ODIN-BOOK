-- CreateTable
CREATE TABLE "_Userfollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Userfollows_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Userfollows_B_index" ON "_Userfollows"("B");

-- AddForeignKey
ALTER TABLE "_Userfollows" ADD CONSTRAINT "_Userfollows_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Userfollows" ADD CONSTRAINT "_Userfollows_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
