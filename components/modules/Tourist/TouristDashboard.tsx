// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Users, DollarSign, Plus } from "lucide-react";
// import Link from "next/link";
// // import { api } from "@/lib/api";
// import { formatDate } from "@/lib/formatters";
// import { serverFetch } from "@/lib/server-fetch";

// interface DashboardStats {
//   totalBookings: number;
//   upcomingBookings: number;
//   completedBookings: number;
//   totalSpent: number;
// }

// interface UpcomingBooking {
//   id: string;
//   tour: { title: string; location: { city: string; country: string } };
//   guide: { name: string };
//   date: string;
//   status: string;
// }

// export default function TouristDashboard() {
//   const [stats, setStats] = useState<DashboardStats>({
//     totalBookings: 0,
//     upcomingBookings: 0,
//     completedBookings: 0,
//     totalSpent: 0,
//   });
//   const [upcomingTours, setUpcomingTours] = useState<UpcomingBooking[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       // Fetch stats
//       const statsResponse = await serverFetch.get("/meta/dashboard");
//     //   setStats(statsResponse.data);
//     setStats()

//       // Fetch upcoming tours
//       const toursResponse = await serverFetch.get("/bookings/my-bookings?status=CONFIRMED&limit=3");
//       setUpcomingTours(toursResponse.data.data);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
//           ))}
//         </div>
//         <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Welcome Back!</h1>
//           <p className="text-gray-600">Here's your travel overview</p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/listings">
//             <Plus className="mr-2 h-4 w-4" />
//             Explore Tours
//           </Link>
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Bookings</p>
//                 <p className="text-2xl font-bold">{stats.totalBookings}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
//                 <Calendar className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Upcoming Tours</p>
//                 <p className="text-2xl font-bold">{stats.upcomingBookings}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
//                 <Users className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Completed</p>
//                 <p className="text-2xl font-bold">{stats.completedBookings}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
//                 <Calendar className="h-6 w-6 text-purple-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Spent</p>
//                 <p className="text-2xl font-bold">${stats.totalSpent}</p>
//               </div>
//               <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
//                 <DollarSign className="h-6 w-6 text-amber-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Upcoming Tours */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold">Upcoming Tours</h2>
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/dashboard/bookings">View All</Link>
//             </Button>
//           </div>

//           {upcomingTours.length === 0 ? (
//             <div className="text-center py-8">
//               <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No upcoming tours</p>
//               <Button asChild className="mt-4">
//                 <Link href="/dashboard/listings">Browse Tours</Link>
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {upcomingTours.map((tour) => (
//                 <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div>
//                     <h3 className="font-medium">{tour.tour.title}</h3>
//                     <div className="flex items-center text-sm text-gray-600 mt-1">
//                       <MapPin className="h-3 w-3 mr-1" />
//                       {tour.tour.location.city}, {tour.tour.location.country}
//                     </div>
//                     <div className="text-sm text-gray-600 mt-1">
//                       Guide: {tour.guide.name}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="font-medium">{formatDate(tour.date)}</div>
//                     <div className="text-sm text-gray-600 capitalize">{tour.status}</div>
//                     <Button size="sm" variant="outline" asChild className="mt-2">
//                       <Link href={`/dashboard/bookings/${tour.id}`}>Details</Link>
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Calendar, 
  Heart, 
  User, 
  MapPin,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface TouristDashboardProps {
  children: React.ReactNode;
}

const navItems = [
  { title: "Dashboard", href: "/tourist/dashboard", icon: LayoutDashboard },
  { title: "Browse Tours", href: "/tourist/dashboard/listings", icon: MapPin },
  { title: "My Bookings", href: "/tourist/dashboard/bookings", icon: Calendar },
  { title: "Wishlist", href: "/tourist/dashboard/wishlist", icon: Heart },
  { title: "Profile", href: "/tourist/dashboard/profile", icon: User },
];

export default function TouristDashboard({ children }: TouristDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href="/" className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold">LocalGuide</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">Tourist</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600"
                onClick={logout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">LocalGuide</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600"
              onClick={logout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Tourist Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">Tourist</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}