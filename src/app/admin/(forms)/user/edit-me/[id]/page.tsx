import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditMe from "@/components/form/crud-form/user/editMe";
import React from "react";

export default function FormElements() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Profile" />
            <EditMe />
        </div>
    );
}
