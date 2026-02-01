-- CreateIndex
CREATE INDEX "ngo_beneficiaries_beneficiary_id_idx" ON "ngo_beneficiaries"("beneficiary_id");

-- CreateIndex
CREATE INDEX "ngo_categories_category_id_idx" ON "ngo_categories"("category_id");

-- CreateIndex
CREATE INDEX "ngo_locations_ngo_id_idx" ON "ngo_locations"("ngo_id");

-- CreateIndex
CREATE INDEX "ngos_city_idx" ON "ngos"("city");

-- CreateIndex
CREATE INDEX "ngos_verified_idx" ON "ngos"("verified");

-- CreateIndex
CREATE INDEX "ngos_city_verified_idx" ON "ngos"("city", "verified");
