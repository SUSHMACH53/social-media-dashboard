// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-100">

//       <Navbar />

//       <div className="flex">
//         <Sidebar />

//         <main className="flex-1 p-6">
//           {children}
//         </main>

//       </div>
//     </div>
//   );
// }




import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}