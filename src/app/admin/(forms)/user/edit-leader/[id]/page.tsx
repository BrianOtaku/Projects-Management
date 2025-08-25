import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditLeader from "@/components/form/crud-form/user/editLeader";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit User" />
      <EditLeader />
    </div>
  );
}
