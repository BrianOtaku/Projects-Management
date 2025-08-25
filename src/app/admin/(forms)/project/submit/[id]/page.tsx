import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Submit from "@/components/form/crud-form/project/submit";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Submit Project" />
      <Submit />
    </div>
  );
}
