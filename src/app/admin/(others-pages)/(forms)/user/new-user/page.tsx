import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewUser from "@/components/form/form-elements/user/newUser";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="New User" />
      <NewUser />
    </div>
  );
}
