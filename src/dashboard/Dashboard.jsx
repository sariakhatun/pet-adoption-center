import React from "react";
import { NavLink, Outlet } from "react-router-dom";
// ✅ Use relative path (this will work)
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
  let { role, roleLoading } = useUserRole();
  console.log("role from dashboard", role);
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#F3F4F6] p-6 shadow-lg">
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-[#34B7A7] text-white"
                  : "text-gray-700 hover:bg-gray-200"
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
                  : "text-gray-700 hover:bg-gray-200"
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
                  : "text-gray-700 hover:bg-gray-200"
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
                  : "text-gray-700 hover:bg-gray-200"
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
                  : "text-gray-700 hover:bg-gray-200"
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
                  : "text-gray-700 hover:bg-gray-200"
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
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            <FaHandsHelping />
            My Donations
          </NavLink>

          {/* admin route */}
          { !roleLoading && role==='admin'&&
            <>
              <NavLink
                to="/dashboard/make-admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-[#34B7A7] text-white"
                      : "text-gray-700 hover:bg-gray-200"
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
                      : "text-gray-700 hover:bg-gray-200"
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
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                <FaDonate />
                All Donations
              </NavLink>
            </>
          }
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
          className="w-64 p-6 bg-[#F3F4F6] shadow-lg lg:hidden"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#34B7A7]">
            User Dashboard
          </h2>
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/dashboard/add-pet"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#34B7A7] text-white"
                    : "text-gray-700 hover:bg-gray-200"
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
                    : "text-gray-700 hover:bg-gray-200"
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
                    : "text-gray-700 hover:bg-gray-200"
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
                    : "text-gray-700 hover:bg-gray-200"
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
                    : "text-gray-700 hover:bg-gray-200"
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
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              <FaHandsHelping />
              My Donations
            </NavLink>
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
