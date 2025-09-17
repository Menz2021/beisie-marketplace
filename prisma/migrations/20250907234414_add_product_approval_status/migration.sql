-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "images" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "brand" TEXT,
    "weight" REAL,
    "dimensions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "products_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_products" ("brand", "categoryId", "createdAt", "description", "dimensions", "id", "images", "isActive", "isFeatured", "name", "originalPrice", "price", "sku", "slug", "stock", "updatedAt", "vendorId", "weight") SELECT "brand", "categoryId", "createdAt", "description", "dimensions", "id", "images", "isActive", "isFeatured", "name", "originalPrice", "price", "sku", "slug", "stock", "updatedAt", "vendorId", "weight" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
