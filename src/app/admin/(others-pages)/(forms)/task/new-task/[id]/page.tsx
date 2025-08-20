import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewTask from "@/components/form/form-elements/task/newTask";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="New Task" />
      <NewTask />
    </div>
  );
}
