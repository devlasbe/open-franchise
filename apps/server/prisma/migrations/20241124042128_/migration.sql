-- CreateTable
CREATE TABLE "Brand" (
    "brand_nm" TEXT NOT NULL,
    "brand_mnno" TEXT NOT NULL,
    "jnghdqrtrs_mnno" TEXT NOT NULL,
    "brno" TEXT NOT NULL,
    "crno" TEXT,
    "jnghdqrtrs_rprsv_nm" TEXT NOT NULL,
    "induty_lclas_nm" TEXT NOT NULL,
    "induty_mlsfc_nm" TEXT NOT NULL,
    "jng_biz_crtra_yr" TEXT NOT NULL,
    "jng_biz_strt_date" TEXT,
    "majr_gds_nm" TEXT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("brand_nm")
);

-- CreateTable
CREATE TABLE "Category" (
    "induty_lclas_nm" TEXT NOT NULL,
    "induty_mclas_nm" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("induty_lclas_nm","induty_mclas_nm")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "brand_nm" TEXT NOT NULL,
    "corp_nm" TEXT NOT NULL,
    "induty_lclas_nm" TEXT NOT NULL,
    "induty_mclas_nm" TEXT NOT NULL,
    "yr" TEXT NOT NULL,
    "frcs_cnt" INTEGER NOT NULL,
    "new_frcs_rgs_cnt" INTEGER NOT NULL,
    "ctrt_end_cnt" INTEGER NOT NULL,
    "ctrt_cncltn_cnt" INTEGER NOT NULL,
    "nm_chg_cnt" INTEGER NOT NULL,
    "avrg_sls_amt" INTEGER NOT NULL,
    "ar_unit_avrg_sls_amt" INTEGER NOT NULL,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("brand_nm","yr")
);

-- CreateTable
CREATE TABLE "Startup" (
    "brand_nm" TEXT NOT NULL,
    "corp_nm" TEXT NOT NULL,
    "yr" TEXT NOT NULL,
    "induty_lclas_nm" TEXT NOT NULL,
    "induty_mclas_nm" TEXT NOT NULL,
    "jng_bzmn_jng_amt" INTEGER NOT NULL,
    "jng_bzmn_edu_amt" INTEGER NOT NULL,
    "jng_bzmn_etc_amt" INTEGER NOT NULL,
    "jng_bzmn_assrnc_amt" INTEGER NOT NULL,
    "smtn_amt" INTEGER NOT NULL,

    CONSTRAINT "Startup_pkey" PRIMARY KEY ("brand_nm")
);

-- CreateTable
CREATE TABLE "Interior" (
    "brand_nm" TEXT NOT NULL,
    "crrncy_unit_cd_nm" TEXT NOT NULL,
    "jng_biz_crtra_yr" TEXT,
    "brand_mnno" TEXT NOT NULL,
    "jnghdqrtrs_mnno" TEXT,
    "induty_lclas_nm" TEXT NOT NULL,
    "induty_mlsfc_nm" TEXT NOT NULL,
    "unit_ar_intrr_amt_scope_val" TEXT,
    "stor_crtra_ar" INTEGER,
    "intrr_amt_scope_val" TEXT,

    CONSTRAINT "Interior_pkey" PRIMARY KEY ("brand_mnno")
);

-- CreateTable
CREATE TABLE "Head" (
    "hmpg_urladr" TEXT,
    "area_nm" TEXT NOT NULL,
    "jng_biz_crtra_yr" TEXT NOT NULL,
    "jnghdqrtrs_mnno" TEXT NOT NULL,
    "jnghdqrtrs_conm_nm" TEXT NOT NULL,
    "brno" TEXT NOT NULL,
    "crno" TEXT,
    "indvdl_corp_se_cd" TEXT NOT NULL,
    "bzmn_rgs_date" TEXT NOT NULL,
    "corp_rg_date" TEXT,
    "jnghdqrtrs_rprs_telno" TEXT,
    "jnghdqrtrs_rprs_fxno" TEXT,
    "jnghdqrtrs_rprsv_nm" TEXT NOT NULL,
    "jnghdqrtrs_ozip" TEXT,
    "lctn_addr" TEXT,
    "lctn_daddr" TEXT,
    "brand_cnt" INTEGER NOT NULL,
    "afflts_cnt" INTEGER NOT NULL,
    "jng_inst_nm" TEXT NOT NULL,
    "ent_scale_nm" TEXT NOT NULL,

    CONSTRAINT "Head_pkey" PRIMARY KEY ("jnghdqrtrs_mnno")
);

-- CreateIndex
CREATE INDEX "franchise_brand_year_index" ON "Brand"("brand_nm");

-- CreateIndex
CREATE INDEX "brand_name_year_index" ON "Statistic"("brand_nm", "yr");

-- CreateIndex
CREATE INDEX "start_up_brand_name_year_index" ON "Startup"("brand_nm", "yr");

-- CreateIndex
CREATE INDEX "Interior_brand_nm_idx" ON "Interior"("brand_nm");

-- CreateIndex
CREATE INDEX "Head_jnghdqrtrs_mnno_idx" ON "Head"("jnghdqrtrs_mnno");

-- AddForeignKey
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_brand_nm_fkey" FOREIGN KEY ("brand_nm") REFERENCES "Brand"("brand_nm") ON DELETE RESTRICT ON UPDATE CASCADE;
