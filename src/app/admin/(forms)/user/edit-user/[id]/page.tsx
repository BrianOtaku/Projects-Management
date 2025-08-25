import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditUser from "@/components/form/crud-form/user/editUser";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit User" />
      <EditUser />
    </div>
  );
}
