import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaUserShield, FaUserTimes, FaSearch } from "react-icons/fa";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MakeAdmin = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();

  const handleSearch = async () => {
    try {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      setUsers(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${
        newRole === "admin" ? "make this user an admin" : "remove admin rights"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, role: newRole } : user
          )
        );
        Swal.fire({
          icon: "success",
          title: `Role updated`,
          text: `User is now ${newRole}`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Role update failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update user role.",
        });
      }
    }
  };

  return (
    <div className="p-4 mt-4 sm:p-6 lg:p-10">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-[#34B7A7] text-center sm:text-left">
        Manage User Roles
      </h2>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} className="w-full sm:w-auto">
          <FaSearch className="mr-2" />
          Search
        </Button>
      </div>

      {/* TABLE: for tablet and up */}
      {users.length > 0 && (
        <div className="hidden sm:block overflow-x-auto">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <img
                        src={
                          user.photoURL ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell>{user.name || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          user.role === "admin"
                            ? "text-[#34B7A7]"
                            : "text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col lg:flex-row gap-2">
                        {user.role === "admin" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRoleChange(user._id, "user")}
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <FaUserTimes className="mr-2" />
                            Remove Admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRoleChange(user._id, "admin")}
                            className="border border-[#34B7A7] bg-white text-black hover:bg-[#34B7A7] hover:text-white"
                          >
                            <FaUserShield className="mr-2" />
                            Make Admin
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* MOBILE CARD layout */}
      {users.length > 0 && (
        <div className="sm:hidden space-y-4">
          {users.map((user) => (
            <Card key={user._id} className="p-4 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    user.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.name || "N/A"}</p>
                  <p className="text-sm break-all text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Role:{" "}
                <span
                  className={`font-semibold ${
                    user.role === "admin"
                      ? "text-[#34B7A7]"
                      : "text-gray-600"
                  }`}
                >
                  {user.role}
                </span>
              </p>
              {user.role === "admin" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRoleChange(user._id, "user")}
                  className="w-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  <FaUserTimes className="mr-2" />
                  Remove Admin
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleRoleChange(user._id, "admin")}
                  className="w-full border border-[#34B7A7] bg-white text-black hover:bg-[#34B7A7] hover:text-white"
                >
                  <FaUserShield className="mr-2" />
                  Make Admin
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
