import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewProject from "@/components/form/crud-form/project/newProject";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="New Project" />
      <NewProject />
    </div>
  );
}
