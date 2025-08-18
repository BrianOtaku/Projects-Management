import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditProject from "@/components/form/form-elements/project/editProject";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Project" />
      <EditProject />
    </div>
  );
}
