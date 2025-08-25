"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function LineChartOne() {
  const options: ApexOptions = {
    legend: {
      show: true, // Hiển thị legend để phân biệt các trạng thái
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#00ccffff", "#ffff00", "#00ff08b9", "#ff0000ff", "#ff6f00ff"], // Bốn màu cho bốn trạng thái
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Giữ nguyên type là line
      toolbar: {
        show: false, // Ẩn toolbar
      },
    },
    stroke: {
      curve: "straight", // Đường thẳng
      width: [2, 2, 2, 2], // Độ dày đường cho bốn trạng thái
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light", // Hoặc "dark", ảnh hưởng đến tông màu gradient
        type: "vertical", // Hướng gradient (vertical, horizontal, diagonal)
        opacityFrom: 0.6, // Độ mờ phía trên
        opacityTo: 0.1, // Độ mờ phía dưới
        gradientToColors: ["#D1D5DB", "#D1D5DB", "#D1D5DB", "#D1D5DB", "#D1D5DB"], // Màu gradient cho từng line
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false, // Tắt nhãn dữ liệu
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "Số lượng dự án", // Thêm tiêu đề trục y để rõ ràng hơn
        style: {
          fontSize: "12px",
        },
      },
    },
  };

  const series = [
    {
      name: "Not Started",
      data: [10, 12, 8, 15, 20, 18, 22, 25, 20, 18, 15, 10], // Dữ liệu mẫu
    },
    {
      name: "In Progress",
      data: [5, 22, 25, 20, 18, 15, 8, 10, 12, 15, 20, 18],
    },
    {
      name: "Completed",
      data: [2, 4, 6, 8, 10, 12, 15, 18, 20, 22, 25, 20],
    },
    {
      name: "Canceled",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
      name: "Overdue",
      data: [2, 3, 1, 6, 5, 10, 4, 7, 3, 8, 1, 5],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Projects Status Overview
        </h3>
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="area" // Giữ type là area để có hiệu ứng gradient
            height={310}
          />
        </div>
      </div>
    </div>
  );
}