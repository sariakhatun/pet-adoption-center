import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import React, { useEffect, useState } from "react";


const ProfilePage = () => {
  const { user } = useAuth(); // Firebase user
  const axiosSecure = useAxiosSecure();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axiosSecure.get("/users/me");
      console.log(res.data)
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false); // ✅ make sure to stop loading
    }
  };
  fetchProfile();
}, []);



  if (loading) return <div className="p-6 mt-12 text-center">Loading...</div>;
  if (!profile) return <div className="p-6 mt-12 text-center">User not found</div>;

  return (
    <div className=" flex items-center justify-center p-6">
      <div className="max-w-3xl w-full  rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <img
            src={profile.photoURL || "https://i.ibb.co/2y0K3xB/default-avatar.png"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#34B7A7] shadow-md"
          />

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
            <p className="text-gray-500 dark:text-white">{profile.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm bg-indigo-100 text-[#34B7A7] rounded-full">
              {profile.role || "User"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg shadow-sm">
            <h2 className="text-sm text-gray-500 font-medium dark:text-white">Phone Number</h2>
            <p className="text-lg text-gray-800 dark:text-white">{profile.phone || "Not provided"}</p>
          </div>

          <div className=" p-4 rounded-lg shadow-sm dark:text-white">
            <h2 className="text-sm text-gray-500 font-medium dark:text-white">Address</h2>
            <p className="text-lg text-gray-800 dark:text-white">{profile.address || "Not provided"}</p>
          </div>

          <div className=" p-4 rounded-lg shadow-sm">
            <h2 className="text-sm text-gray-500 font-medium dark:text-white">Joined On</h2>
            <p className="text-lg text-gray-800 dark:text-white">
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>

          <div className=" p-4 rounded-lg shadow-sm">
            <h2 className="text-sm text-gray-500 font-medium dark:text-white">Status</h2>
            <p className="text-lg text-green-600 font-semibold">
              {profile.status || "Active"}
            </p>
          </div>
        </div>

        {/* Actions */}
        {/* <div className="mt-8 flex justify-center md:justify-end gap-4">
          <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Edit Profile
          </button>
          <button className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            Logout
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
