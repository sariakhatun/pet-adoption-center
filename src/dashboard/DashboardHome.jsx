import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import useUserRole from "@/hooks/useUserRole";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalPets: 0,
    totalAdoptions: 0,
    totalDonationCampaigns: 0,
    totalDonations: 0,
    totalAdmins: 0,
  });
  let { role, roleLoading } = useUserRole();
  const [petsByCategory, setPetsByCategory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get("https://b11a12-server-side-sariakhatun.vercel.app/dashboard/stats");
        setStats(statsRes.data);

        const petsRes = await axios.get("https://b11a12-server-side-sariakhatun.vercel.app/pets?all=true");
        const categoryCounts = {};
        petsRes.data.forEach((pet) => {
          const category = pet.petCategory || "Other";
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        setPetsByCategory(categoryCounts);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
  labels: Object.keys(petsByCategory),
  datasets: [
    {
      label: "Number of Pets",
      data: Object.values(petsByCategory),
      backgroundColor: Object.keys(petsByCategory).map(
        (_, i) =>
          ["#34B7A7", "#5fd1c2", "#f5acbc"][i % 3] // cycling through your gradient colors
      ),
      borderWidth: 1,
    },
  ],
};

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Pets by Category", font: { size: 18 } },
    },
  };

  const statsArray = [
    { title: "Total Pets", value: stats.totalPets },
    { title: "Total Adoptions", value: stats.totalAdoptions },
    { title: "Donation Campaigns", value: stats.totalDonationCampaigns },
    { title: "Total Donations ($)", value: stats.totalDonations },
    { title: "Admins", value: stats.totalAdmins },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
        Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {statsArray.map((stat, index) => (
          <div
            key={stat.title}
            className="p-4 sm:p-6 rounded-xl shadow-lg text-white flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${chartData.datasets[0].backgroundColor[index % chartData.datasets[0].backgroundColor.length]}, ${
                chartData.datasets[0].backgroundColor[(index + 1) % chartData.datasets[0].backgroundColor.length]
              })`,
            }}
          >
            <p className="text-sm sm:text-base font-semibold">{stat.title}</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full">
        <div className="h-64 sm:h-80 md:h-96">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
