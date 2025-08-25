"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { getTeams } from "@/services/team";
import { Team } from "@/constants/interfaces";
import Link from "next/link";
import { PencilIcon, PlusIcon } from "@/icons";

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        console.error("Lỗi khi load projects:", err);
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
      <div className="flex flex-col gap-2 mb-4 flex-row items-center justify-between">
        <Link
          href="team/new-team"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <PlusIcon />
          New team
        </Link>
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
                <TableCell isHeader className="px-5 py-4 sm:px-6 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Team Name
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Leader
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-base dark:text-gray-400">
                  Members
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-center text-base dark:text-gray-400">
                  {""}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {teams.map((teams) => {

                return (
                  <TableRow key={teams.id.toString()}>
                    <TableCell className="px-5 py-4 sm:px-6 font-medium text-gray-800 text-start text-theme-sm dark:text-white/90" >
                      {teams.teamName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                          {/* <Image
                            width={80}
                            height={80}
                            src={user.avatar || "/images/user/default.jpg"}
                            alt={user.name}
                          /> */}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {teams.leader?.name || "No Leader Assigned"}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {teams.leader?.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex -space-x-2">
                        {teams.members?.map((member, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                          >
                            {/* <Image
                              width={24}
                              height={24}
                              src={member.user.image || "/default-avatar.png"}
                              alt={`Team member ${index + 1}`}
                              className="w-full"
                            /> */}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`team/edit-team/${teams.id}`} title="Edit Team" className="flex justify-center items-center">
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
