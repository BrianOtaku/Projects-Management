import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditTask from "@/components/form/crud-form/task/editTask";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Task" />
      <EditTask />
    </div>
  );
}
