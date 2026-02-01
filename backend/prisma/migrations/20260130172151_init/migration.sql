-- CreateTable
CREATE TABLE "beneficiaries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ngo_beneficiaries" (
    "ngo_id" INTEGER NOT NULL,
    "beneficiary_id" INTEGER NOT NULL,

    CONSTRAINT "ngo_beneficiaries_pkey" PRIMARY KEY ("ngo_id","beneficiary_id")
);

-- CreateTable
CREATE TABLE "ngo_categories" (
    "ngo_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "ngo_categories_pkey" PRIMARY KEY ("ngo_id","category_id")
);

-- CreateTable
CREATE TABLE "ngo_locations" (
    "id" SERIAL NOT NULL,
    "ngo_id" INTEGER,
    "link" TEXT NOT NULL,

    CONSTRAINT "ngo_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ngos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "donation_info" TEXT,
    "needs" TEXT,
    "verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ngos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "beneficiaries_name_key" ON "beneficiaries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "ngo_beneficiaries" ADD CONSTRAINT "ngo_beneficiaries_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ngo_beneficiaries" ADD CONSTRAINT "ngo_beneficiaries_ngo_id_fkey" FOREIGN KEY ("ngo_id") REFERENCES "ngos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ngo_categories" ADD CONSTRAINT "ngo_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ngo_categories" ADD CONSTRAINT "ngo_categories_ngo_id_fkey" FOREIGN KEY ("ngo_id") REFERENCES "ngos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ngo_locations" ADD CONSTRAINT "ngo_locations_ngo_id_fkey" FOREIGN KEY ("ngo_id") REFERENCES "ngos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
