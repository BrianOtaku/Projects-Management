import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectManagement from "@/components/tables/projectManagement";

export default function Dashboard() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-4 md:space-y-6">
          <EcommerceMetrics />
          <MonthlySalesChart />
          <ProjectManagement />
        </div>
      </div>
    </div>
  );
}
