"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CustomerAnalyticsChartProps {
  popupStats: {
    opens: number;
    closes: number;
    success: number;
    rejection: number;
  };
}

export default function CustomerAnalyticsChart({
  popupStats,
}: CustomerAnalyticsChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Popup Opens", "Closes", "Success", "Rejection"],
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    colors: ["#3b82f6", "#8b5cf6", "#10b981", "#ef4444"],
    legend: {
      show: false,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val) {
          return val + " interactions";
        },
      },
    },
  };

  const series = [
    {
      name: "Count",
      data: [
        popupStats.opens,
        popupStats.closes,
        popupStats.success,
        popupStats.rejection,
      ],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Popup Analytics
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customer interaction statistics with popups
        </p>
      </div>

      <div className="mb-6">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Opens
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white/90">
            {popupStats.opens}
          </p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Closes
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white/90">
            {popupStats.closes}
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Success
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white/90">
            {popupStats.success}
          </p>
        </div>

        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Rejection
            </span>
          </div>
          <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white/90">
            {popupStats.rejection}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Success Rate
          </span>
          <span className="font-semibold text-gray-800 dark:text-white/90">
            {popupStats.opens > 0
              ? ((popupStats.success / popupStats.opens) * 100).toFixed(1)
              : 0}
            %
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Rejection Rate
          </span>
          <span className="font-semibold text-gray-800 dark:text-white/90">
            {popupStats.opens > 0
              ? ((popupStats.rejection / popupStats.opens) * 100).toFixed(1)
              : 0}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
