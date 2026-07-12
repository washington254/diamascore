import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomerAnalyticsChart from "@/components/customers/CustomerAnalyticsChart";
import Badge from "@/components/ui/badge/Badge";
import { getCustomerByIdFromDb } from "@/data/customers";

interface CustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: CustomerPageProps): Promise<Metadata> {
  const { id } = await params;
  const customer = await getCustomerByIdFromDb(id);

  if (!customer) {
    return {
      title: "Customer Not Found | Diamas Core",
    };
  }

  return {
    title: `${customer.name} | Diamas Core`,
    description: `View analytics and information for ${customer.name}`,
  };
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomerByIdFromDb(id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={customer.name} />

      <div className="space-y-6">
        {/* Customer Info Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Customer Information
            </h3>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    width={80}
                    height={80}
                    src={customer.avatar}
                    alt={customer.name}
                    className="h-20 w-20 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    {customer.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {customer.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      size="sm"
                      color={
                        customer.status === "Active"
                          ? "success"
                          : customer.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {customer.status}
                    </Badge>
                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {customer.platform}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/customers"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Customers
                </Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Customer ID
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-gray-800 dark:text-white/90">
                  #{customer.id.padStart(6, "0")}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Registered Date
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {new Date(customer.registeredDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Interactions
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {customer.popupStats.opens} popups
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <CustomerAnalyticsChart popupStats={customer.popupStats} />
      </div>
    </div>
  );
}
