import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewTeam from "@/components/form/form-elements/team/newTeam";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="New Team" />
      <NewTeam />
    </div>
  );
}
