import type { Customer } from "@/data/customers";

type CustomerDbRow = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  platform: string;
  status: string | null;
  registeredAt: Date;
  popupOpens: number;
  popupCloses: number;
  popupSuccess: number;
  popupRejection: number;
};

const defaultAvatar = "/images/user/user-17.jpg";

const normalizePlatform = (platform: string): Customer["platform"] => {
  const normalized = platform.trim().toLowerCase();

  if (normalized === "wordpress") {
    return "WordPress";
  }

  return "Shopify";
};

const statusMap: Record<string, Customer["status"]> = {
  Active: "Active",
  Inactive: "Inactive",
  Pending: "Pending",
};

export function mapCustomerRecord(record: CustomerDbRow): Customer {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    avatar: record.avatar || defaultAvatar,
    platform: normalizePlatform(record.platform),
    status: statusMap[record.status || "Active"] || "Active",
    registeredDate: record.registeredAt.toISOString(),
    popupStats: {
      opens: record.popupOpens,
      closes: record.popupCloses,
      success: record.popupSuccess,
      rejection: record.popupRejection,
    },
  };
}

export function mapCustomerRecords(records: CustomerDbRow[]): Customer[] {
  return records.map(mapCustomerRecord);
}
