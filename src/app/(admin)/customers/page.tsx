import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomerTable from "@/components/customers/CustomerTable";
import { getAllCustomersFromDb } from "@/data/customers";

export const metadata: Metadata = {
  title: "Customers | Diamas Core",
  description: "View and manage all customers in Diamas Core",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }> | { search?: string };
}) {
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const customers = await getAllCustomersFromDb();

  return (
    <div>
      <PageBreadcrumb pageTitle="Customers" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                All Customers
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : "Manage and view customer information"}
              </p>
            </div>


          </div>

          <CustomerTable customers={customers} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
