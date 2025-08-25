import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LineChartOne from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import { ProjectDashboard } from "@/components/dashboard/projectDashboard";


export default function Dashboard() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-4 md:space-y-6">
          <ProjectDashboard />
          <BarChartOne />
          <LineChartOne />
        </div>
      </div>
    </div>
  );
}
