ALTER TABLE "Submission" ADD COLUMN "drinkType" TEXT;

CREATE INDEX "Submission_drinkType_idx" ON "Submission"("drinkType");
