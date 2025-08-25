import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Accept from "@/components/form/crud-form/task/accept";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Approve Task" />
      <Accept />
    </div>
  );
}
