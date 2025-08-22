"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import { Task } from "@/constants/interfaces";
import { CheckCircleIcon } from "@/icons";
import { getTasks } from "@/services/task";
import { getMe } from "@/services/user";

export default function PendingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getMe();
        const data = await getTasks();

        const filterData = data.filter(
          (task: Task) => task.project?.team?.leaderId === user.id
            && task.status === "PENDING"
        );

        setTasks(filterData);
      } catch (err) {
        console.error("Lỗi khi load tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 flex-row items-center justify-end">
        <div className="flex items-center gap-3">
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
                  Task Name
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Project Name
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Description
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Assigned Staff
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
              {tasks.map((task) => {

                return (
                  <TableRow key={task.id.toString()}>
                    <TableCell className="px-5 py-4 sm:px-6 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90">
                      {task.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color="primary"
                      >
                        {task.project?.title}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {task.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color="light"
                      >
                        {task.user?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          task.status === "IN_PROGRESS" ? "warning"
                            : task.status === "COMPLETED" ? "success"
                              : task.status === "NOT_STARTED" ? "info"
                                : task.status === "PENDING" ? "pending"
                                  : task.status === "OVERDUE" ? "overdue"
                                    : "error"
                        }
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`task/accept/${task.id}`} title="Approve" className="flex justify-center">
                        <CheckCircleIcon className="fill-current hover:text-gray-800 dark:hover:text-white/90" />
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
