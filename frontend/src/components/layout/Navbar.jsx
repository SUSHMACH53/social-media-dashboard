export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-slate-800 text-white px-6 py-4">

      {/* Left Side */}
      <h2 className="text-lg font-semibold">
        Social Media Dashboard
      </h2>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Notification Icon */}
        <span className="cursor-pointer">🔔</span>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="text-sm">User</span>
        </div>

      </div>
    </nav>
  );
}