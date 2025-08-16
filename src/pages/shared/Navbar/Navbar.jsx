import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // 👈 import cross (X) icon
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Swal from "sweetalert2";
import PetNectLogo from "../logo/PetNectLogo";
import useAuth from "@/hooks/useAuth";
import ThemeToggle from "../ThemeToggle";
import { FaPlusCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // 👈 state for controlling menu

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged Out Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const baseItems = (
    <>
      <NavLink to="/" className="hover:text-[#34B7A7] dark:text-white">
        Home
      </NavLink>
      <NavLink
        to="/petListing"
        className="hover:text-[#34B7A7] dark:text-white"
      >
        Pet Listing
      </NavLink>
      <NavLink
        to="/donationCampaigns"
        className="hover:text-[#34B7A7] dark:text-white"
      >
        Donation Campaigns
      </NavLink>
    </>
  );

  const protectedItems = (
    <>
      <NavLink to="/add-pet" className="hover:text-[#34B7A7] dark:text-white">
        Add A Pet
      </NavLink>
      <NavLink
        to="/create-campaign"
        className="hover:text-[#34B7A7] dark:text-white"
      >
        Create Donation Campaign
      </NavLink>
    </>
  );

  return (
    <nav className="fixed top-0 z-100 shadow-sm w-full px-4 md:px-8 lg:px-16 py-3 flex justify-between items-center bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Left - Logo + Mobile Menu */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Mobile Menu */}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              {menuOpen ? <X /> : <Menu />} {/* 👈 toggle Menu / X icon */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col space-y-2 p-4">
            {/* Close button inside menu */}
            <button
              className="self-end mb-2"
              onClick={() => setMenuOpen(false)} // 👈 closes menu
            >
              <X className="w-6 h-6 text-gray-700 dark:text-white" />
            </button>
            {baseItems}
            {user && protectedItems}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <PetNectLogo />
      </div>

      {/* Center - Desktop Navigation */}
      <div className="hidden md:hidden lg:flex gap-6 font-medium text-gray-700">
        {baseItems}
        {user && protectedItems}
      </div>

      {/* Right - Auth/Profile */}
      <div className="flex items-center gap-3">
        <ThemeToggle></ThemeToggle>
        {user ? (
          <>
            {/* Profile Image Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={
                    user?.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-[#34B7A7] cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 mt-2">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="hover:text-[#34B7A7] w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login">
              <Button className="bg-[#34B7A7] hover:bg-[#2fa296] text-xs px-4 py-2">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#34B7A7] hover:bg-[#2fa296] text-xs px-4 py-2">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
