import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/projectManagement";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-4 md:space-y-6">
          <EcommerceMetrics />
          <MonthlySalesChart />
          <BasicTableOne />
        </div>
      </div>
    </div>
  );
}
