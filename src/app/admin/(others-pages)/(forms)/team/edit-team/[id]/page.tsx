import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditTeam from "@/components/form/form-elements/team/editTeam";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Team" />
      <EditTeam />
    </div>
  );
}
