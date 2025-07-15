import React from "react";
import {
  FaPaw,
  FaHeart,
  FaDonate,
  FaListUl,
  FaUserShield,
} from "react-icons/fa";
import useUserRole from "@/hooks/useUserRole";
import DashboardHomeSkeleton from "@/skeleton/DashboardHomeSkeleton";

const quickLinks = [
  {
    id: 1,
    title: "Add a Pet",
    to: "/dashboard/add-pet",
    icon: <FaPaw />,
    color: "bg-[#34B7A7]",
  },
  {
    id: 2,
    title: "My Pets",
    to: "/dashboard/my-pets",
    icon: <FaListUl />,
    color: "bg-[#3B82F6]",
  },
  {
    id: 3,
    title: "Adoption Requests",
    to: "/dashboard/adoption-requests",
    icon: <FaHeart />,
    color: "bg-[#EF4444]",
  },
  {
    id: 4,
    title: "Create Donation Campaign",
    to: "/dashboard/create-campaign",
    icon: <FaDonate />,
    color: "bg-[#F59E0B]",
  },
];

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <DashboardHomeSkeleton></DashboardHomeSkeleton>
  }

  const stats = [
    {
      id: 1,
      title: "Total Pets Added",
      value: 42,
      icon: <FaPaw className="text-3xl text-[#34B7A7]" />,
      bg: "bg-[#D1FAE5]",
      textColor: "text-[#065F46]",
    },
    {
      id: 2,
      title: "Adoption Requests",
      value: 17,
      icon: <FaHeart className="text-3xl text-[#F87171]" />,
      bg: "bg-[#FEE2E2]",
      textColor: "text-[#B91C1C]",
    },
    {
      id: 3,
      title: "Donation Campaigns",
      value: 5,
      icon: <FaDonate className="text-3xl text-[#FBBF24]" />,
      bg: "bg-[#FEF3C7]",
      textColor: "text-[#92400E]",
    },
    ...(role === "admin"
      ? [
          {
            id: 4,
            title: "Total Donations",
            value: "$2,450",
            icon: <FaListUl className="text-3xl text-[#60A5FA]" />,
            bg: "bg-[#DBEAFE]",
            textColor: "text-[#1E40AF]",
          },
          {
            id: 5,
            title: "Admins Count",
            value: 3,
            icon: <FaUserShield className="text-3xl text-[#7C3AED]" />,
            bg: "bg-[#EDE9FE]",
            textColor: "text-[#5B21B6]",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="rounded-lg bg-gradient-to-r from-[#34B7A7] to-[#1C7A7A] p-8 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold mb-2">Welcome Back!</h1>
        <p className="text-lg opacity-90 max-w-xl">
          Manage your pets, adoption requests, donation campaigns, and more from
          your dashboard.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ id, title, value, icon, bg, textColor }) => (
          <div
            key={id}
            className={`flex items-center gap-4 p-6 rounded-xl shadow-md ${bg} dark:bg-opacity-30`}
          >
            <div className="p-4 rounded-full bg-white dark:bg-gray-700">
              {icon}
            </div>
            <div>
              <p
                className={`font-semibold text-lg ${textColor} dark:text-white`}
              >
                {title}
              </p>
              <p
                className={`text-2xl font-bold ${textColor} dark:text-white`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {quickLinks.map(({ id, title, to, icon, color }) => (
            <a
              key={id}
              href={to}
              className={`flex items-center gap-3 p-5 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 ${color} dark:bg-opacity-90`}
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-lg font-semibold">{title}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
