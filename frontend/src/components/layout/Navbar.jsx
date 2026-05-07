"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function getStoredUser() {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const handleStorage = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();
    if (!query) {
      router.push("/posts");
      return;
    }

    router.push(`/posts?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Creator Studio
          </p>
          <h1 className="text-lg font-bold text-slate-950">
            Social Media Dashboard
          </h1>
        </div>

        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
          <label className="relative flex-1 min-w-[220px] md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              Search
            </span>
            <input
              aria-label="Search dashboard"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pl-16 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
              placeholder="posts, analytics, audience"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <button
            type="submit"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Search
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {initials}
            </div>
            <span className="max-w-28 truncate text-sm font-medium text-slate-700">
              {user?.name || "User"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}
