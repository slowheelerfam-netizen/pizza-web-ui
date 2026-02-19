-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "displayId" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT NOT NULL DEFAULT 'REGISTER',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ovenEnteredAt" TIMESTAMP(3),
    "actualReadyAt" TIMESTAMP(3),
    "estimatedReadyAt" TIMESTAMP(3),
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerType" TEXT NOT NULL DEFAULT 'PICKUP',
    "customerAddress" TEXT,
    "isWalkIn" BOOLEAN NOT NULL DEFAULT false,
    "assignedTo" TEXT,
    "specialInstructions" TEXT,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT,
    "crust" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "toppings" TEXT NOT NULL DEFAULT '[]',

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "orderId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetPhone" TEXT,
    "targetName" TEXT,
    "targetPaymentId" TEXT,

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "targetEntityType" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isOnDuty" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
