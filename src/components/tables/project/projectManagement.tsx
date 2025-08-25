"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Link from "next/link";
import { getProjects } from "@/services/project";
import { Project } from "@/constants/interfaces";
import { GeminiColorIcon, PencilIcon, PlusIcon } from "@/icons";
import { Modal } from "../../ui/modal";
import Input from "../../form/ui/input/InputField";
import { createProjectWithAI } from "@/services/ai";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProjects();
        const filterData = data.filter((project: Project) => project.status !== "PENDING");

        setProjects(filterData);
      } catch (err) {
        console.error("Lỗi khi load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loadingAI) return;

    setLoadingAI(true);
    try {
      const newProject = await createProjectWithAI({ message });
      setProjects((prev) => [...prev, newProject]);
      setMessage("");
      closeModal();
    } catch (err) {
      console.error("Error sending/fetching messages:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center justify-between">
        <div className="flex gap-2">
          <Link
            href="project/new-project"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <PlusIcon />
            New project
          </Link>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <GeminiColorIcon className="w-3 h-3" />
            New with AI
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className="max-w-md sm:max-w-xl p-4 space-y-4 sm:space-y-6 sm:p-6"
          showCloseButton={true}
          isFullscreen={false}
        >
          <form onSubmit={handleSend}>
            <Input
              type="text"
              placeholder="Tell me what you would like to build?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loadingAI}
            />
          </form>
        </Modal>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-4 sm:px-6 font-medium text-gray-500 text-start text-base dark:text-gray-400 w-1/4">
                  Project Name
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Assigned Team
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Description
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-center text-base dark:text-gray-400">
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {projects.map((project) => {

                return (
                  <TableRow key={project.id.toString()}>
                    <TableCell className="px-5 py-4 sm:px-6 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {project.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {project.team?.teamName ? (
                        <Badge
                          size="sm"
                          color="primary"
                        >
                          {project.team?.teamName}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">No Team Assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {project.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          project.status === "IN_PROGRESS" ? "warning"
                            : project.status === "COMPLETED" ? "success"
                              : project.status === "NOT_STARTED" ? "info"
                                : project.status === "PENDING" ? "pending"
                                  : project.status === "OVERDUE" ? "overdue"
                                    : "error"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`project/edit-project/${project.id}`} title="Edit Project" className="flex justify-center items-center">
                        <PencilIcon className="fill-current hover:text-gray-800 dark:hover:text-white/90" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
