import { unstable_noStore as noStore } from "next/cache";
import prisma from "../../lib/prisma";
import { mapCustomerRecord, mapCustomerRecords } from "../lib/customer-utils";

// Customer data types and dummy data for Diamas Core

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  platform: "Shopify" | "WordPress";
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

];

export async function getAllCustomersFromDb(): Promise<Customer[]> {
  noStore();

  try {
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
  noStore();

  try {
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
  platform: "Shopify" | "WordPress",
): Customer[] => {
  return customers.filter((customer) => customer.platform === platform);
};
