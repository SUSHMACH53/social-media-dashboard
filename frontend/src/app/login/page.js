"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-5xl items-center gap-8 md:grid-cols-[1fr_420px]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Social Media Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-950 md:text-5xl">
            Plan, publish, and understand your content in one place.
          </h1>
          <p className="mt-4 max-w-xl text-slate-600">
            Track engagement, manage posts, review performance signals, and keep your content calendar moving.
          </p>
        </section>

        <form
          onSubmit={handleLogin}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-950">Login</h2>
          <p className="mt-1 text-sm text-slate-500">Use the account you created for this dashboard.</p>

          <label className="mt-6 block text-sm font-semibold text-slate-700">
            Email
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none transition focus:border-blue-500"
              onChange={handleChange}
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Password
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none transition focus:border-blue-500"
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            New here?{" "}
            <Link className="font-semibold text-blue-700" href="/signup">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
