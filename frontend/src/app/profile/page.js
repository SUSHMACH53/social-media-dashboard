"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { apiRequest } from "../../lib/api";

function getStoredUser() {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userData = getStoredUser();
    if (!userData) return;

    apiRequest(`/api/profile?email=${encodeURIComponent(userData.email)}`)
      .then(setProfile)
      .catch(() => {
        setProfile({
          name: userData.name,
          email: userData.email,
          bio: userData.bio || "Social media strategist building a consistent content engine.",
          avatarUrl: userData.avatarUrl || "",
          followers: 1240,
        });
      });
  }, []);

  const handleChange = (event) => {
    setProfile((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const updated = await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });

      setProfile(updated);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: updated._id,
          name: updated.name,
          email: updated.email,
          bio: updated.bio,
          avatarUrl: updated.avatarUrl,
        })
      );
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep your dashboard identity and creator bio up to date.
          </p>
        </div>

        {!profile ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
            Loading profile...
          </div>
        ) : (
          <section className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-slate-950 text-3xl font-bold text-white">
                {profile.name?.slice(0, 1).toUpperCase() || "U"}
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">{profile.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>
              <p className="mt-4 leading-6 text-slate-700">{profile.bio}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniStat label="Followers" value={profile.followers || 1240} />
                <MiniStat label="Posts" value={profile.postsCount || 0} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-slate-950">Profile Details</h2>
                <button
                  type="button"
                  onClick={() => setIsEditing((current) => !current)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <div className="mt-5 space-y-4">
                  <Field label="Name">
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </Field>
                  <Field label="Bio">
                    <textarea
                      name="bio"
                      rows={5}
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                  >
                    Save Profile
                  </button>
                </div>
              ) : (
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Detail label="Name" value={profile.name} />
                  <Detail label="Email" value={profile.email} />
                  <Detail label="Bio" value={profile.bio} wide />
                </dl>
              )}
            </div>
          </section>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Detail({ label, value, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-800">{value}</dd>
    </div>
  );
}
