"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  Clock,
  Eye,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { getGuideDashboardMetaData } from "@/services/guide/dashboard.service";
import { getBookingsForGuide } from "@/services/booking/booking.service";
import { getMyListings } from "@/services/listing/listing.service";
import { IBooking } from "@/types/booking.interface";
import { IListing } from "@/types/listing.interface";
import { toast } from "sonner";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";

interface DashboardStats {
  totalListings: number;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  pendingBookings: number;
  upcomingTours: number;
}

export default function GuideDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    totalBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    pendingBookings: 0,
    upcomingTours: 0,
  });
  const [recentBookings, setRecentBookings] = useState<IBooking[]>([]);
  const [recentListings, setRecentListings] = useState<IListing[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardData, bookingsData, listingsData] = await Promise.all([
        getGuideDashboardMetaData(),
        getBookingsForGuide("?limit=5&sortBy=createdAt&sortOrder=desc"),
        getMyListings("?limit=3&sortBy=createdAt&sortOrder=desc"),
      ]);

      if (dashboardData.success) setStats(dashboardData.data);
      if (bookingsData.success) setRecentBookings(bookingsData.data);
      if (listingsData.success) setRecentListings(listingsData.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-orange-100 text-orange-700 border-orange-200",
      CONFIRMED: "bg-green-100 text-green-700 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guide Dashboard</h2>
          <p className="text-muted-foreground">Manage your tours, bookings, and track your performance.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchDashboardData} variant="outline" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" className="gap-2" asChild>
            <Link href="/guide/dashboard/listings/create">
              <PlusCircle className="h-4 w-4" /> New Tour
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Stats Cards Grid (Now 5 Columns) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Listings" value={stats.totalListings} icon={<MapPin className="text-blue-600" />} bgColor="bg-blue-50" link="/guide/dashboard/listings" />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={<Calendar className="text-purple-600" />} bgColor="bg-purple-50" link="/guide/dashboard/bookings" subtitle={`${stats.upcomingTours} upcoming`} />
        <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(0)}`} icon={<DollarSign className="text-green-600" />} bgColor="bg-green-50" subtitle="All time income" />
        <StatCard title="Avg Rating" value={stats.averageRating.toFixed(1)} icon={<Star className="text-yellow-600 fill-yellow-600" />} bgColor="bg-yellow-50" link="/guide/dashboard/reviews" />
        <StatCard title="Pending Actions" value={stats.pendingBookings} icon={<Clock className="text-orange-600" />} bgColor="bg-orange-50" highlight={stats.pendingBookings > 0} link="/guide/dashboard/bookings?status=PENDING" />
      </div>

      {/* 3. Main Content: Bookings & Listings */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings (Left side - 2/3 width) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link href="/guide/dashboard/bookings">View All</Link></Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <EmptyState icon={<Calendar className="h-8 w-8" />} text="No bookings found" />
            ) : (
              <div className="divide-y">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {booking.tourist?.name?.[0] || "T"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{booking.tourist?.name || "Guest Tourist"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(booking.date).toLocaleDateString()} • ${booking.totalPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <Button size="sm" variant="ghost" asChild><Link href={`/guide/dashboard/bookings/${booking._id}`}><Eye className="h-4 w-4" /></Link></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Listings (Right side - 1/3 width) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Tours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentListings.length === 0 ? (
              <EmptyState icon={<MapPin className="h-8 w-8" />} text="No tours created" />
            ) : (
              recentListings.map((listing) => (
                <div key={listing.id} className="flex gap-3 p-2 border rounded-lg group hover:border-primary/50 transition-colors">
                  <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {listing.images?.[0] ? (
                      <img src={listing.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <MapPin className="h-full w-full p-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">${listing.price} • {listing.location?.city}</p>
                    <Link href={`/guide/dashboard/listings/edit/${listing.id}`} className="text-[10px] text-primary hover:underline mt-1 block">Edit Details</Link>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full text-xs" asChild>
              <Link href="/guide/dashboard/listings">View All Tours</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 4. Pending Action Alert */}
      {stats.pendingBookings > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-orange-900 text-sm">Action Required</h4>
            <p className="text-xs text-orange-700">You have {stats.pendingBookings} new booking requests waiting for your approval.</p>
          </div>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
            <Link href="/guide/dashboard/bookings?status=PENDING">Review Now</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function StatCard({ title, value, icon, bgColor, subtitle, link, highlight = false }: any) {
  const Content = (
    <Card className={`transition-all hover:shadow-md ${highlight ? "border-orange-200 shadow-sm ring-1 ring-orange-100" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className={`h-10 w-10 ${bgColor} rounded-lg flex items-center justify-center`}>{icon}</div>
          {link && <Eye className="h-4 w-4 text-muted-foreground/50" />}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );

  return link ? <Link href={link}>{Content}</Link> : Content;
}

function EmptyState({ icon, text }: any) {
  return (
    <div className="text-center py-10">
      <div className="flex justify-center text-muted-foreground/30 mb-3">{icon}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}// // components/modules/Guide/GuideDashboardContent.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
 
// import {
//   Calendar,
//   MapPin,
//   Users,
//   DollarSign,
//   Star,
//   Clock,
//   Eye,
//   TrendingUp,
//   AlertCircle,
// } from "lucide-react";
// import Link from "next/link";
// import { getGuideDashboardMetaData } from "@/services/guide/dashboard.service";  
// import { getBookingsForGuide } from "@/services/booking/booking.service";
// import { getMyListings } from "@/services/listing/listing.service";
// import { IBooking } from "@/types/booking.interface";
// import { IListing } from "@/types/listing.interface";
// import { toast } from "sonner";
// import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";

// interface DashboardStats {
//   totalListings: number;
//   totalBookings: number;
//   totalEarnings: number;
//   averageRating: number;
//   pendingBookings: number;
//   upcomingTours: number;
// }

// export default function GuideDashboardContent() {
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalListings: 0,
//     totalBookings: 0,
//     totalEarnings: 0,
//     averageRating: 0,
//     pendingBookings: 0,
//     upcomingTours: 0,
//   });
//   const [recentBookings, setRecentBookings] = useState<IBooking[]>([]);
//   const [recentListings, setRecentListings] = useState<IListing[]>([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all dashboard data in parallel
//       const [dashboardData, bookingsData, listingsData] = await Promise.all([
//         getGuideDashboardMetaData(),
//         getBookingsForGuide("?limit=5&sortBy=createdAt&sortOrder=desc"),
//         getMyListings("?limit=3&sortBy=createdAt&sortOrder=desc"),
//       ]);

//       if (dashboardData.success && dashboardData.data) {
//         setStats(dashboardData.data);
//       }

//       if (bookingsData.success && bookingsData.data) {
//         setRecentBookings(bookingsData.data);
//       }

//       if (listingsData.success && listingsData.data) {
//         setRecentListings(listingsData.data);
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       toast.error("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "CONFIRMED":
//         return "bg-green-100 text-green-800";
//       case "COMPLETED":
//         return "bg-blue-100 text-blue-800";
//       case "CANCELLED":
//         return "bg-gray-100 text-gray-800";
//       case "DECLINED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   if (loading) {
//     return <DashboardSkeleton />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h2 className="text-2xl font-bold">Welcome back!</h2>
//               <p className="text-muted-foreground">
//                 Here's what's happening with your tour business today.
//               </p>
//             </div>
//             <Button
//               onClick={fetchDashboardData}
//               variant="outline"
//               size="sm"
//               className="gap-2"
//             >
//               <TrendingUp className="h-4 w-4" />
//               Refresh
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats Grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {/* Total Listings */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Active Listings
//                 </p>
//                 <p className="text-2xl font-bold mt-1">{stats.totalListings}</p>
//               </div>
//               <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <MapPin className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <Link
//                 href="/guide/dashboard/listings"
//                 className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
//               >
//                 View all listings
//                 <Eye className="h-3 w-3" />
//               </Link>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Total Bookings */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Total Bookings
//                 </p>
//                 <p className="text-2xl font-bold mt-1">{stats.totalBookings}</p>
//               </div>
//               <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Calendar className="h-6 w-6 text-purple-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <Badge variant="secondary" className="text-xs">
//                 {stats.upcomingTours} upcoming
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Total Earnings */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Total Earnings
//                 </p>
//                 <p className="text-2xl font-bold mt-1">
//                   {formatCurrency(stats.totalEarnings)}
//                 </p>
//               </div>
//               <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
//                 <DollarSign className="h-6 w-6 text-green-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <p className="text-xs text-muted-foreground">
//                 From completed tours
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Average Rating */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Average Rating
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <p className="text-2xl font-bold">{stats.averageRating}</p>
//                   <div className="flex items-center gap-0.5">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-4 w-4 ${
//                           i < Math.floor(stats.averageRating)
//                             ? "text-yellow-500 fill-yellow-500"
//                             : "text-gray-300"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <Star className="h-6 w-6 text-yellow-600" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <Link
//                 href="/guide/dashboard/reviews"
//                 className="text-sm text-blue-600 hover:underline"
//               >
//                 View reviews
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity Grid */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Recent Bookings */}
//         <Card>
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle>Recent Bookings</CardTitle>
//               <Badge
//                 variant="outline"
//                 className={
//                   stats.pendingBookings > 0
//                     ? "bg-yellow-50 text-yellow-700 border-yellow-200"
//                     : ""
//                 }
//               >
//                 {stats.pendingBookings} pending
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {recentBookings.length === 0 ? (
//               <div className="text-center py-8">
//                 <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">No recent bookings</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   When tourists book your tours, they will appear here
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {recentBookings.map((booking) => (
//                   <div
//                     key={booking.id || booking.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Users className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-sm">
//                           {booking.tourist?.name || "Tourist"}
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className="text-xs text-gray-500">
//                             {formatDate(booking.date)}
//                           </span>
//                           <span className="text-xs text-gray-500">•</span>
//                           <span className="text-xs font-medium">
//                             ${booking.totalPrice}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex flex-col items-end gap-1">
//                       <Badge
//                         className={`text-xs ${getStatusColor(booking.status)}`}
//                       >
//                         {booking.status}
//                       </Badge>
//                       <Link
//                         href={`/guide/dashboard/bookings/${
//                           booking.id || booking.id
//                         }`}
//                         className="text-xs text-blue-600 hover:underline"
//                       >
//                         View
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="pt-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full"
//                     asChild
//                   >
//                     <Link href="/guide/dashboard/bookings">
//                       View All Bookings
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Recent Listings */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle>Recent Listings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {recentListings.length === 0 ? (
//               <div className="text-center py-8">
//                 <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">No listings yet</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Create your first tour listing to get started
//                 </p>
//                 <Button className="mt-4" asChild>
//                   <Link href="/guide/dashboard/listings/create">
//                     Create Listing
//                   </Link>
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {recentListings.map((listing) => (
//                   <div
//                     key={listing.id || listing.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 bg-purple-100 rounded-lg overflow-hidden flex-shrink-0">
//                         {listing.images && listing.images.length > 0 ? (
//                           <img
//                             src={listing.images[0]}
//                             alt={listing.title}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : (
//                           <div className="h-full w-full bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center">
//                             <MapPin className="h-5 w-5 text-white" />
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium text-sm line-clamp-1">
//                           {listing.title}
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <span className="text-xs text-gray-500">
//                             {listing.location.city}
//                           </span>
//                           <span className="text-xs text-gray-500">•</span>
//                           <span className="text-xs font-medium">
//                             ${listing.price}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex flex-col items-end gap-1">
//                       <Badge
//                         variant={
//                           listing.active ? "default" : "secondary"
//                         }
//                         className="text-xs"
//                       >
//                         {listing.active ? "Active" : "Inactive"}
//                       </Badge>
//                       <Link
//                         href={`/guide/dashboard/listings/edit/${
//                           listing.id || listing.id
//                         }`}
//                         className="text-xs text-blue-600 hover:underline"
//                       >
//                         Edit
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="pt-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full"
//                     asChild
//                   >
//                     <Link href="/guide/dashboard/listings">
//                       View All Listings
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Button className="h-auto py-4" variant="outline" asChild>
//               <Link href="/guide/dashboard/listings/create">
//                 <div className="text-left">
//                   <div className="font-medium mb-1">Create New Listing</div>
//                   <p className="text-sm text-muted-foreground">
//                     Add a new tour experience
//                   </p>
//                 </div>
//               </Link>
//             </Button>
//             <Button className="h-auto py-4" variant="outline" asChild>
//               <Link href="/guide/dashboard/bookings">
//                 <div className="text-left">
//                   <div className="font-medium mb-1">Manage Bookings</div>
//                   <p className="text-sm text-muted-foreground">
//                     Review booking requests
//                   </p>
//                 </div>
//               </Link>
//             </Button>
//             <Button className="h-auto py-4" variant="outline" asChild>
//               <Link href="/guide/dashboard/reviews">
//                 <div className="text-left">
//                   <div className="font-medium mb-1">View Reviews</div>
//                   <p className="text-sm text-muted-foreground">
//                     See tourist feedback
//                   </p>
//                 </div>
//               </Link>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Alert Section */}
//       {stats.pendingBookings > 0 && (
//         <Card className="border-yellow-200 bg-yellow-50">
//           <CardContent className="pt-6">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <h4 className="font-semibold text-yellow-800">
//                   Action Required
//                 </h4>
//                 <p className="text-sm text-yellow-700 mt-1">
//                   You have {stats.pendingBookings} pending booking
//                   {stats.pendingBookings !== 1 ? "s" : ""} waiting for your
//                   response. Please review them within 24 hours.
//                 </p>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="mt-3 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
//                   asChild
//                 >
//                   <Link href="/guide/dashboard/bookings?status=PENDING">
//                     <Clock className="mr-2 h-4 w-4" />
//                     Review Pending Bookings
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

 