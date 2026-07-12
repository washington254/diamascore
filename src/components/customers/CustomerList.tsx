"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "../ui/badge/Badge";
import { Customer } from "@/data/customers";

interface CustomerListProps {
  customers: Customer[];
  maxDisplay?: number;
}

export default function CustomerList({
  customers,
  maxDisplay = 5,
}: CustomerListProps) {
  const displayCustomers = customers.slice(0, maxDisplay);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Customers
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {displayCustomers.map((customer) => (
          <Link
            key={customer.id}
            href={`/customers/${customer.id}`}
            className="group block rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-brand-500 hover:bg-brand-50 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-brand-500 dark:hover:bg-brand-900/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    width={48}
                    height={48}
                    src={customer.avatar}
                    alt={customer.name}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {customer.name}
                  </p>
                  <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                    {customer.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-gray-600 text-theme-xs dark:text-gray-400">
                    {customer.platform}
                  </p>
                </div>
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
