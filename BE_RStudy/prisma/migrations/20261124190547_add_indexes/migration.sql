-- CreateIndex
CREATE INDEX "AiConversation_studentId_idx" ON "AiConversation"("studentId");

-- CreateIndex
CREATE INDEX "Invoice_studentId_idx" ON "Invoice"("studentId");

-- CreateIndex
CREATE INDEX "Invoice_discountCodeId_idx" ON "Invoice"("discountCodeId");

-- CreateIndex
CREATE INDEX "Reply_commentId_idx" ON "Reply"("commentId");

-- CreateIndex
CREATE INDEX "Resource_categoryId_idx" ON "Resource"("categoryId");

-- CreateIndex
CREATE INDEX "ViolationReport_status_idx" ON "ViolationReport"("status");

-- CreateIndex
CREATE INDEX "ViolationReport_reporterAccountId_idx" ON "ViolationReport"("reporterAccountId");
