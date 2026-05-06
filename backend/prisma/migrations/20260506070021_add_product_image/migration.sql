-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
