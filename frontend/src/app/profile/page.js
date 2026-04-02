"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      setProfile(data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) {
    return (
      <DashboardLayout>
        <p>Loading profile...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Profile</h1>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm w-96">
        {isEditing ? (
          <>
            <input
              className="border p-2 w-full mb-2"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <textarea
              className="border p-2 w-full mb-2"
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
            />

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="mt-2">{profile.bio}</p>

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