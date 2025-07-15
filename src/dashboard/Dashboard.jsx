import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import {
  FaPlusCircle,
  FaListUl,
  FaHeart,
  FaDonate,
  FaRegListAlt,
  FaHandsHelping,
  FaHome,
  FaUserShield,
  FaPaw,
} from "react-icons/fa";

import useUserRole from "@/hooks/useUserRole";

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
  console.log("Role in Dashboard:", role, "Loading:", roleLoading);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#F3F4F6] dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-700">
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <FaHome />
            Dashboard Home
          </NavLink>

          <NavLink
            to="/dashboard/add-pet"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <FaPlusCircle />
            Add a Pet
          </NavLink>

          <NavLink
            to="/dashboard/my-pets"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <FaListUl />
            My Added Pets
          </NavLink>

          <NavLink
            to="/dashboard/adoption-requests"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <FaHeart />
            Adoption Request
          </NavLink>

          <NavLink
            to="/dashboard/create-campaign"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <FaDonate />
            Create Donation Campaign
          </NavLink>

          <NavLink
            to="/dashboard/my-campaigns"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <FaRegListAlt />
            My Donation Campaigns
          </NavLink>

          <NavLink
            to="/dashboard/my-donations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <FaHandsHelping />
            My Donations
          </NavLink>

          {/* Admin Links */}
          {!roleLoading && role === "admin" && (
            <>
              <NavLink
                to="/dashboard/make-admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-[#34B7A7] text-white"
                      : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaUserShield />
                Make Admin
              </NavLink>

              <NavLink
                to="/dashboard/all-pets"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-[#34B7A7] text-white"
                      : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaPaw />
                All Pets
              </NavLink>

              <NavLink
                to="/dashboard/all-donations"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-[#34B7A7] text-white"
                      : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaDonate />
                All Donations
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Mobile sidebar using shadcn Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-16 left-4 z-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-64 p-6 bg-[#F3F4F6] dark:bg-gray-800 shadow-lg dark:shadow-gray-700 lg:hidden"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#34B7A7] dark:text-[#34B7A7]">
            User Dashboard
          </h2>

          {/* Debug info */}
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
            Role: {role || "unknown"} | Loading: {roleLoading ? "Yes" : "No"}
          </p>

          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaHome />
              Dashboard Home
            </NavLink>

            <NavLink
              to="/dashboard/add-pet"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaPlusCircle />
              Add a Pet
            </NavLink>

            <NavLink
              to="/dashboard/my-pets"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaListUl />
              My Added Pets
            </NavLink>

            <NavLink
              to="/dashboard/adoption-requests"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaHeart />
              Adoption Request
            </NavLink>

            <NavLink
              to="/dashboard/create-campaign"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaDonate />
              Create Donation Campaign
            </NavLink>

            <NavLink
              to="/dashboard/my-campaigns"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaRegListAlt />
              My Donation Campaigns
            </NavLink>

            <NavLink
              to="/dashboard/my-donations"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaHandsHelping />
              My Donations
            </NavLink>

            {/* Admin Links on mobile */}
            {!roleLoading && role === "admin" && (
              <>
                <NavLink
                  to="/dashboard/make-admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-[#34B7A7] text-white"
                        : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <FaUserShield />
                  Make Admin
                </NavLink>

                <NavLink
                  to="/dashboard/all-pets"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-[#34B7A7] text-white"
                        : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <FaPaw />
                  All Pets
                </NavLink>

                <NavLink
                  to="/dashboard/all-donations"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-[#34B7A7] text-white"
                        : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <FaDonate />
                  All Donations
                </NavLink>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
