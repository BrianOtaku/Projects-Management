"use client";
import React, { useEffect, useState } from "react";
// import Image from "next/image";
import Link from "next/link";
import { PencilIcon, PlusIcon } from "@/icons";
import { User } from "@/constants/interfaces";
import { getUsers } from "@/services/user";
import Badge from "../ui/badge/Badge";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers();
        const filteredUsers = data.filter((user: User) => user.role !== "MANAGER");
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header buttons */}
      <div className="flex flex-col gap-2 mb-4 flex-row items-center justify-between">
        <Link
          href="user/new-user"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <PlusIcon />
          New User
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

      {/* User list */}
      {users.map((user) => (
        <div
          key={user.id}
          className="p-5 mb-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6"
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                {/* <Image
                  width={80}
                  height={80}
                  src={user.avatar || "/images/user/default.jpg"}
                  alt={user.name}
                /> */}
              </div>
              <div className="order-3 xl:order-2">
                <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90 text-center xl:text-left">
                  {user.name}
                </h4>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center xl:text-left mb-2 xl:mb-0">
                  {user.email}
                </p>

                <div className="hidden w-100 h-px bg-gray-300 dark:bg-gray-700 xl:block mb-2"></div>

                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                  <Badge
                    size="sm"
                    color={
                      user.role === "MANAGER"
                        ? "error"
                        : user.role === "LEADER"
                          ? "info"
                          : "success"
                    }
                  >
                    {user.role}
                  </Badge>

                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>

                  <div className="flex flex-wrap gap-1">
                    {user.leader?.length
                      ? user.leader.slice(0, 2).map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {t.teamName}
                        </span>
                      ))
                      : <span className="text-sm text-gray-400">No Team Assigned</span>
                    }
                    {user.leader && user.leader.length > 2 && (
                      <span className="text-xs text-gray-400">+{user.leader.length - 2} more</span>
                    )}
                  </div>

                </div>
              </div>
            </div>

            <Link
              title="Edit User"
              href={`user/edit-user/${user.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <PencilIcon />
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
