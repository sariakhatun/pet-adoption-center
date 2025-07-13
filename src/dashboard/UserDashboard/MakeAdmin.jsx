import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  // Show confirmation dialog
  const result = await Swal.fire({
    title: `Are you sure?`,
    text: `You want to ${newRole === "admin" ? "make this user an admin" : "remove admin rights"}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  });

  if (result.isConfirmed) {
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
      // Update user list locally
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

  console.log('users from makeadmin',users)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#34B7A7]">Manage User Roles</h2>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Button onClick={handleSearch}>
          <FaSearch className="mr-2" />
          Search
        </Button>
      </div>

      {users.length > 0 && (
        <Card className="overflow-x-auto">
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
                      src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${
                        user.role === "admin" ? "text-[#34B7A7] " : "text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
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
                        className="border border-[#34B7A7] bg-white text-black  hover:bg-[#34B7A7]  hover:text-white"
                      >
                        <FaUserShield className="mr-2" />
                        Make Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default MakeAdmin;
