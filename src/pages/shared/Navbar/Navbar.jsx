import React from "react"
import { NavLink, Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import Swal from "sweetalert2"
import PetNectLogo from "../logo/PetNectLogo"
import useAuth from "@/hooks/useAuth"

const Navbar = () => {
  const { user, logOut } = useAuth()

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged Out Successfully",
          showConfirmButton: false,
          timer: 1500,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const navItems = (
    <>
      <NavLink to="/" className="hover:text-[#34B7A7]">
        Home
      </NavLink>
      <NavLink to="/petListing" className="hover:text-[#34B7A7]">
        Pet Listing
      </NavLink>
      <NavLink to="/donationCampaigns" className="hover:text-[#34B7A7]">
        Donation Campaigns
      </NavLink>
    </>
  )

  return (
    <nav className="bg-white shadow-sm w-full px-4 py-3 flex justify-between items-center">
      {/* Left - Logo + Mobile Menu */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col space-y-2">
            {navItems}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <PetNectLogo />
      </div>

      {/* Center - Desktop Navigation */}
      <div className="hidden md:flex gap-6 font-medium text-gray-700">
        {navItems}
      </div>

      {/* Right - Auth/Profile */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Profile Image Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
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
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Button */}
            <Button
              onClick={handleLogOut}
              className="bg-[#34B7A7] hover:bg-[#2fa296] text-xs px-4 py-2"
            >
              Logout
            </Button>
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
  )
}

export default Navbar
