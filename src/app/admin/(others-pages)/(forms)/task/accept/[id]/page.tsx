import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Accept from "@/components/form/form-elements/task/accept";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Approve Task" />
      <Accept />
    </div>
  );
}
