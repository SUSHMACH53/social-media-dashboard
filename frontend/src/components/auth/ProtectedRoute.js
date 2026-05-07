"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem("token");
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    Promise.resolve().then(() => setIsChecking(false));
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600">
        Checking your session...
      </div>
    );
  }

  return children;
}
