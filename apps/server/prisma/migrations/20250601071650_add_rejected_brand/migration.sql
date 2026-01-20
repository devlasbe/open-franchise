-- CreateTable
CREATE TABLE "RejectedBrand" (
    "brand_nm" TEXT NOT NULL,

    CONSTRAINT "RejectedBrand_pkey" PRIMARY KEY ("brand_nm")
);

-- CreateIndex
CREATE INDEX "RejectedBrand_brand_nm_idx" ON "RejectedBrand"("brand_nm");
