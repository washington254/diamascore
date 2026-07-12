import prisma from "../../lib/prisma";
import { mapCustomerRecord, mapCustomerRecords } from "../lib/customer-utils";

// Customer data types and dummy data for Diamas Core

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  platform: "Web" | "Mobile" | "Desktop";
  status: "Active" | "Inactive" | "Pending";
  registeredDate: string;
  popupStats: {
    opens: number;
    closes: number;
    success: number;
    rejection: number;
  };
}

export const customers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "/images/user/user-17.jpg",
    platform: "Web",
    status: "Active",
    registeredDate: "2024-01-15",
    popupStats: {
      opens: 245,
      closes: 180,
      success: 65,
      rejection: 115,
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "/images/user/user-18.jpg",
    platform: "Mobile",
    status: "Active",
    registeredDate: "2024-02-10",
    popupStats: {
      opens: 312,
      closes: 240,
      success: 72,
      rejection: 168,
    },
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "/images/user/user-19.jpg",
    platform: "Desktop",
    status: "Pending",
    registeredDate: "2024-03-05",
    popupStats: {
      opens: 128,
      closes: 95,
      success: 33,
      rejection: 62,
    },
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@example.com",
    avatar: "/images/user/user-20.jpg",
    platform: "Web",
    status: "Active",
    registeredDate: "2024-01-28",
    popupStats: {
      opens: 420,
      closes: 305,
      success: 115,
      rejection: 190,
    },
  },
  {
    id: "5",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    avatar: "/images/user/user-21.jpg",
    platform: "Mobile",
    status: "Inactive",
    registeredDate: "2023-12-20",
    popupStats: {
      opens: 89,
      closes: 72,
      success: 17,
      rejection: 55,
    },
  },
  {
    id: "6",
    name: "David Anderson",
    email: "david.anderson@example.com",
    avatar: "/images/user/user-22.jpg",
    platform: "Desktop",
    status: "Active",
    registeredDate: "2024-02-14",
    popupStats: {
      opens: 198,
      closes: 142,
      success: 56,
      rejection: 86,
    },
  },
  {
    id: "7",
    name: "Olivia Thompson",
    email: "olivia.thompson@example.com",
    avatar: "/images/user/user-23.jpg",
    platform: "Web",
    status: "Active",
    registeredDate: "2024-03-12",
    popupStats: {
      opens: 275,
      closes: 210,
      success: 65,
      rejection: 145,
    },
  },
  {
    id: "8",
    name: "Robert Garcia",
    email: "robert.garcia@example.com",
    avatar: "/images/user/user-24.jpg",
    platform: "Mobile",
    status: "Pending",
    registeredDate: "2024-03-20",
    popupStats: {
      opens: 56,
      closes: 42,
      success: 14,
      rejection: 28,
    },
  },
  {
    id: "9",
    name: "Isabella Lee",
    email: "isabella.lee@example.com",
    avatar: "/images/user/user-25.jpg",
    platform: "Desktop",
    status: "Active",
    registeredDate: "2024-01-08",
    popupStats: {
      opens: 367,
      closes: 280,
      success: 87,
      rejection: 193,
    },
  },
  {
    id: "10",
    name: "William Brown",
    email: "william.brown@example.com",
    avatar: "/images/user/user-26.jpg",
    platform: "Web",
    status: "Inactive",
    registeredDate: "2023-11-15",
    popupStats: {
      opens: 145,
      closes: 118,
      success: 27,
      rejection: 91,
    },
  },
  {
    id: "11",
    name: "Ava Taylor",
    email: "ava.taylor@example.com",
    avatar: "/images/user/user-27.jpg",
    platform: "Mobile",
    status: "Active",
    registeredDate: "2024-02-25",
    popupStats: {
      opens: 289,
      closes: 215,
      success: 74,
      rejection: 141,
    },
  },
  {
    id: "12",
    name: "Ethan Moore",
    email: "ethan.moore@example.com",
    avatar: "/images/user/user-28.jpg",
    platform: "Desktop",
    status: "Active",
    registeredDate: "2024-03-01",
    popupStats: {
      opens: 176,
      closes: 130,
      success: 46,
      rejection: 84,
    },
  },
  {
    id: "13",
    name: "Mia White",
    email: "mia.white@example.com",
    avatar: "/images/user/user-29.jpg",
    platform: "Web",
    status: "Pending",
    registeredDate: "2024-03-18",
    popupStats: {
      opens: 92,
      closes: 68,
      success: 24,
      rejection: 44,
    },
  },
  {
    id: "14",
    name: "Noah Harris",
    email: "noah.harris@example.com",
    avatar: "/images/user/user-30.jpg",
    platform: "Mobile",
    status: "Active",
    registeredDate: "2024-01-22",
    popupStats: {
      opens: 334,
      closes: 255,
      success: 79,
      rejection: 176,
    },
  },
  {
    id: "15",
    name: "Emma Clark",
    email: "emma.clark@example.com",
    avatar: "/images/user/user-31.jpg",
    platform: "Desktop",
    status: "Active",
    registeredDate: "2024-02-05",
    popupStats: {
      opens: 221,
      closes: 168,
      success: 53,
      rejection: 115,
    },
  },
];

async function ensureCustomerTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Customer" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "avatar" TEXT,
      "platform" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Active',
      "registeredAt" TIMESTAMP(3) NOT NULL,
      "popupOpens" INTEGER NOT NULL DEFAULT 0,
      "popupCloses" INTEGER NOT NULL DEFAULT 0,
      "popupSuccess" INTEGER NOT NULL DEFAULT 0,
      "popupRejection" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function getAllCustomersFromDb(): Promise<Customer[]> {
  try {
    await ensureCustomerTable();

    const rows = await prisma.customer.findMany({
      orderBy: {
        registeredAt: "desc",
      },
    });

    return mapCustomerRecords(rows);
  } catch (error) {
    console.error("Failed to load customers from DB:", error);
    return customers;
  }
}

export async function getCustomerByIdFromDb(
  id: string,
): Promise<Customer | undefined> {
  try {
    await ensureCustomerTable();

    const row = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!row) {
      return undefined;
    }

    return mapCustomerRecord(row);
  } catch (error) {
    console.error("Failed to load customer from DB:", error);
    return customers.find((customer) => customer.id === id);
  }
}

// Helper functions
export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find((customer) => customer.id === id);
};

export const getActiveCustomersCount = (): number => {
  return customers.filter((customer) => customer.status === "Active").length;
};

export const getTotalCustomersCount = (): number => {
  return customers.length;
};

export const getCustomersByPlatform = (
  platform: "Web" | "Mobile" | "Desktop",
): Customer[] => {
  return customers.filter((customer) => customer.platform === platform);
};
