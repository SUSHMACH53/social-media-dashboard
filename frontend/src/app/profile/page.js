"use client";

import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Social media enthusiast 🚀"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mt-6 max-w-xl">

        {isEditing ? (
          <>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="mt-2">{user.bio}</p>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}