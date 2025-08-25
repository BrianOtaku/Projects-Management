"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { BoxIconLine } from "@/icons";
import { Project } from "@/constants/interfaces";
import { getProjects } from "@/services/project";


export const ProjectDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getProjects();
      setProjects(data);
    }
    fetchData();
  }, []);

  const total = projects.length;
  const working = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const finished = projects.filter((p) => p.status === "COMPLETED").length;
  const canceled = projects.filter((p) => p.status === "CANCELED").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* Total Projects */}
      <MetricCard
        icon={<BoxIconLine className="dark:text-gray-400" />}
        label="Total Projects"
        value={total}
        badge="Projects"
      />

      {/* On Working Projects */}
      <MetricCard
        icon={<BoxIconLine className="dark:text-gray-400" />}
        label="On Working Projects"
        value={working}
        badge="Projects"
      />

      {/* Finished Projects */}
      <MetricCard
        icon={<BoxIconLine className="dark:text-gray-400" />}
        label="Finished Projects"
        value={finished}
        badge="Projects"
      />

      {/* Canceled Projects */}
      <MetricCard
        icon={<BoxIconLine className="dark:text-gray-400" />}
        label="Canceled Projects"
        value={canceled}
        badge="Projects"
      />
    </div>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  badge: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
      {icon}
    </div>
    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
      <Badge color="success">{badge}</Badge>
    </div>
  </div>
);
