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

const platformMap: Record<string, Customer["platform"]> = {
  Web: "Web",
  Mobile: "Mobile",
  Desktop: "Desktop",
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
    platform: platformMap[record.platform] || "Web",
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
