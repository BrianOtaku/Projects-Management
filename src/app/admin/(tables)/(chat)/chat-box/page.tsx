import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ChatBox from "@/components/tables/chat/chatBox";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Gemini" />
      <ChatBox />
    </div>
  );
}
