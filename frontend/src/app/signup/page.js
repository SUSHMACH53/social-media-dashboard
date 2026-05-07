"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success("Account created. Please login.");
      router.replace("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center">
        <form
          onSubmit={handleSignup}
          className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-slate-950">Create Account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Start managing posts, engagement, and analytics.
          </p>

          <label className="mt-6 block text-sm font-semibold text-slate-700">
            Name
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none transition focus:border-blue-500"
              onChange={handleChange}
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
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
              minLength={6}
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
            className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-blue-700" href="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
