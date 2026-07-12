import type { Metadata } from "next";
import React from "react";
import CustomerMetrics from "@/components/customers/CustomerMetrics";
import CustomerList from "@/components/customers/CustomerList";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import {
  customers,
  getActiveCustomersCount,
  getTotalCustomersCount,
} from "@/data/customers";

export const metadata: Metadata = {
  title: "Dashboard | Diamas Core",
  description: "Diamas Core admin dashboard",
};

export default function Dashboard() {
  const totalCustomers = getTotalCustomersCount();
  const activeCustomers = getActiveCustomersCount();

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <CustomerMetrics
          totalCustomers={totalCustomers}
          activeCustomers={activeCustomers}
        />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <CustomerList customers={customers} maxDisplay={6} />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>
    </div>
  );
}
