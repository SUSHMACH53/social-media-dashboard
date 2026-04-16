"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Posts", path: "/posts" },
    { name: "Analytics", path: "/analytics" },
    { name: "Profile", path: "/profile" }
  ];

  return (
    <aside className="w-64 bg-white min-h-full p-5 shadow-sm">
      <ul className="space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`block p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}