import React from "react";

const ProfilePage = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <img
            src={user?.image || "https://i.ibb.co/2y0K3xB/default-avatar.png"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
          />

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full">
              {user?.role || "User"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-sm text-gray-500 font-medium">Phone Number</h2>
            <p className="text-lg text-gray-800">{user?.phone || "Not provided"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-sm text-gray-500 font-medium">Address</h2>
            <p className="text-lg text-gray-800">{user?.address || "Not provided"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-sm text-gray-500 font-medium">Joined On</h2>
            <p className="text-lg text-gray-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-sm text-gray-500 font-medium">Status</h2>
            <p className="text-lg text-green-600 font-semibold">
              {user?.status || "Active"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center md:justify-end gap-4">
          <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Edit Profile
          </button>
          <button className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
