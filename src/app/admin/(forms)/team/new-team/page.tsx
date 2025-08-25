import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewTeam from "@/components/form/crud-form/team/newTeam";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="New Team" />
      <NewTeam />
    </div>
  );
}
