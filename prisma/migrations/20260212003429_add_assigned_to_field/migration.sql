-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isOnDuty" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayId" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'REGISTER',
    "totalPrice" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerType" TEXT NOT NULL DEFAULT 'PICKUP',
    "customerAddress" TEXT,
    "isWalkIn" BOOLEAN NOT NULL DEFAULT false,
    "assignedTo" TEXT,
    "cancelledAt" DATETIME
);
INSERT INTO "new_Order" ("createdAt", "customerAddress", "customerName", "customerPhone", "customerType", "displayId", "id", "isWalkIn", "source", "status", "totalPrice", "updatedAt") SELECT "createdAt", "customerAddress", "customerName", "customerPhone", "customerType", "displayId", "id", "isWalkIn", "source", "status", "totalPrice", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
