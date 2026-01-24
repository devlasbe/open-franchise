-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "brand_nm" TEXT NOT NULL,
    "parent_id" TEXT,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedIp" (
    "id" TEXT NOT NULL,
    "ip_pattern" TEXT NOT NULL,
    "reason" TEXT,
    "blocked_by" TEXT NOT NULL,
    "blocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BlockedIp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_brand_nm_created_at_idx" ON "Comment"("brand_nm", "created_at");

-- CreateIndex
CREATE INDEX "Comment_parent_id_idx" ON "Comment"("parent_id");

-- CreateIndex
CREATE INDEX "BlockedIp_ip_pattern_idx" ON "BlockedIp"("ip_pattern");
