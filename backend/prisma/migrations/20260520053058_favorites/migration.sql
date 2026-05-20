-- CreateTable
CREATE TABLE "FavoriteProduct" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteProduct_user_id_idx" ON "FavoriteProduct"("user_id");

-- CreateIndex
CREATE INDEX "FavoriteProduct_product_id_idx" ON "FavoriteProduct"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteProduct_user_id_product_id_key" ON "FavoriteProduct"("user_id", "product_id");

-- AddForeignKey
ALTER TABLE "FavoriteProduct" ADD CONSTRAINT "FavoriteProduct_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteProduct" ADD CONSTRAINT "FavoriteProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
