
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  User, 
  Phone, 
  Mail,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { api } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/formatters";
import { serverFetch } from "@/lib/server-fetch";
import { initPayment } from "@/services/payments/payments.service";
import { toast } from "sonner";

interface BookingDetailsProps {
  booking: {
    _id: string;
    tour: {
      title?: string;
      description: string;
      price: number;
      durationHours: number;
      meetingPoint: string;
      location: {
        city: string;
        country: string;
        address: string;
      };
    };
    guide: {
      name: string;
      email: string;
      phone?: string;
    };
    date: string;
    guestCount: number;
    totalPrice: number;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    createdAt: string;
    updatedAt: string;
  };
}

export default function TouristBookingDetails({ booking }: BookingDetailsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setLoading(true);
    try {
      await serverFetch.patch(`/bookings/${booking._id}/cancel`);
      router.refresh();
      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "FAILED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const handlePayment = async (bookingId: string) => {
  setLoading(true);
  try {
    const result = await initPayment(bookingId);
    
    // কনসোলে চেক করুন কি আসছে
    console.log("Backend Response:", result);

    if (result.success && result.data?.redirectUrl) {
      // এটিই আপনাকে SSLCommerz-এর পেমেন্ট পেজে নিয়ে যাবে
      window.location.href = result.data.redirectUrl; 
     
    } else {
      toast.error(result.message || "Payment URL not found");
    }
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
//   const handlePayment = async (bookingId: string) => {
//   try {
//     const result = await initPayment(bookingId); 
    
//     // কনসোলে চেক করুন ডাটা আসছে কি না
//     console.log("Payment Init Result:", result);

//     if (result.success && result.data?.redirectUrl) {
//       // এই লাইনটিই আপনাকে SSLCommerz-এর পেমেন্ট পেজে নিয়ে যাবে
//       // যেখানে কার্ড নম্বর/বিকাশ দেওয়ার অপশন থাকবে
//       window.location.href = result.data.redirectUrl; 
//     } else {
//       alert("Payment initiation failed: " + (result.message || "Unknown error"));
//     }
//   } catch (error) {
//     console.error("Payment Error:", error);
//   }
// };
// const handlePayment = async (bookingId: string) => {
//   try {
//     const result = await initPayment(bookingId);
//     if (result.success && result.data.redirectUrl) {
//       // SSLCommerz পেমেন্ট পেজে পাঠিয়ে দিবে
//       window.location.href = result.data.redirectUrl;
//     } else {
//       alert(result.message || "Payment initiation failed");
//     }
//   } catch (error) {
//     console.error("Payment Error:", error);
//     alert("Something went wrong with payment");
//   }
// };
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bookings
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
  {booking?.tour?.title || "Tour details not available"}
</h1>
          <p className="text-gray-600">Booking details and information</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(booking.status)} >
            {booking.status}
          </Badge>
          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
            {booking.paymentStatus}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tour & Guide Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tour Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  {/* <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium">
                      {booking.tour.location.city}, {booking.tour.location.country}
                    </div>
                    <div className="text-sm text-gray-600">{booking.tour.meetingPoint}</div>
                  </div> */}
                  <div className="font-medium">
  {booking?.tour?.location?.city ? (
    `${booking.tour.location.city}, ${booking.tour.location.country}`
  ) : (
    "Location details pending"
  )}
</div>
<div className="text-sm text-gray-600">
  {booking?.tour?.meetingPoint || "Meeting point not specified"}
</div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Tour Date & Time</div>
                    <div className="font-medium">{formatDateTime(booking.date)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium">{booking?.tour?.durationHours} hours</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Number of Guests</div>
                    <div className="font-medium">{booking.guestCount} people</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guide Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Guide Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Guide Name</div>
                    <div className="font-medium">{booking.guide.name}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{booking.guide.email}</div>
                  </div>
                </div>
                {booking.guide.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{booking.guide.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Price & Actions */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Price Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour Price</span>
                  <span>${booking?.tour?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Guests</span>
                  <span>{booking.guestCount}</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    <DollarSign className="inline h-5 w-5" />
                    {booking.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Status</span>
                  <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-mono">{booking._id?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booked On</span>
                  <span>{formatDateTime(booking.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span>{formatDateTime(booking.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
         
{booking.status === "CONFIRMED" && booking.paymentStatus !== "PAID" && (
  <Card>
    <CardContent className="p-6">
      <h3 className="font-semibold mb-4 text-center">Complete Your Booking</h3>
      <Button
        className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
        onClick={() => handlePayment(booking._id)} 
      >
        <DollarSign className="mr-2 h-5 w-5" />
        Pay & Confirm Now
      </Button>
      <p className="text-xs text-center text-gray-500 mt-2">
        You will be redirected to SSLCommerz secure payment gateway.
      </p>
    </CardContent>
  </Card>
)}
          {booking.status === "PENDING" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {loading ? "Cancelling..." : "Cancel Booking"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// // src/components/modules/Tourist/TouristBookingDetails.tsx
// "use client";

// import { IBooking } from "@/types/booking.interface";
// import { ArrowLeft, Calendar, User, DollarSign, MapPin, Users, Clock, AlertCircle } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cancelBooking } from "@/services/booking/booking.service";
// import { useState } from "react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import ReviewForm from "./ReviewForm";

// export default function TouristBookingDetails({ booking }: { booking: IBooking }) {
//   const router = useRouter();
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);

//   const handleCancelBooking = async () => {
//     if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
//       return;
//     }

//     setIsCancelling(true);
//     try {
//       const result = await cancelBooking(booking.id);
//       if (result.success) {
//         toast.success("Booking cancelled successfully");
//         router.refresh();
//       } else {
//         toast.error(result.message || "Failed to cancel booking");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "An error occurred");
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'long',
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusInfo = () => {
//     switch (booking.status) {
//       case 'PENDING':
//         return {
//           message: 'Awaiting guide confirmation',
//           color: 'text-yellow-600',
//           bg: 'bg-yellow-50',
//           border: 'border-yellow-200'
//         };
//       case 'CONFIRMED':
//         return {
//           message: 'Confirmed by guide',
//           color: 'text-green-600',
//           bg: 'bg-green-50',
//           border: 'border-green-200'
//         };
//       case 'COMPLETED':
//         return {
//           message: 'Tour completed successfully',
//           color: 'text-purple-600',
//           bg: 'bg-purple-50',
//           border: 'border-purple-200'
//         };
//       case 'CANCELLED':
//         return {
//           message: 'Booking cancelled',
//           color: 'text-gray-600',
//           bg: 'bg-gray-50',
//           border: 'border-gray-200'
//         };
//       case 'DECLINED':
//         return {
//           message: 'Declined by guide',
//           color: 'text-red-600',
//           bg: 'bg-red-50',
//           border: 'border-red-200'
//         };
//       default:
//         return {
//           message: booking.status,
//           color: 'text-gray-600',
//           bg: 'bg-gray-50',
//           border: 'border-gray-200'
//         };
//     }
//   };

//   const statusInfo = getStatusInfo();

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <Link 
//           href="/tourist/dashboard/bookings" 
//           className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Bookings
//         </Link>
//          <Badge variant="outline">
//   Booking #{(booking.id ||   "").slice(-8).toUpperCase()}
// </Badge>
//       </div>

//       <div className="space-y-6">
//         {/* Status Card */}
//         <Card className={`${statusInfo.bg} ${statusInfo.border}`}>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div className="space-y-1">
//                 <h3 className={`font-semibold ${statusInfo.color}`}>
//                   {statusInfo.message}
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   {booking.status === 'PENDING' && 'The guide will respond within 24 hours'}
//                   {booking.status === 'CONFIRMED' && 'Your tour is confirmed and ready!'}
//                   {booking.status === 'COMPLETED' && 'We hope you enjoyed your experience'}
//                   {booking.status === 'CANCELLED' && 'This booking has been cancelled'}
//                   {booking.status === 'DECLINED' && 'The guide was unable to accept this booking'}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <div className={`text-2xl font-bold ${statusInfo.color}`}>
//                   ${booking.totalPrice}
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {booking.paymentStatus === 'PAID' ? 'Paid' : 'Payment pending'}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Tour Details */}
//           <Card>
//             <CardContent className="pt-6 space-y-4">
//               <h3 className="font-semibold">Tour Details</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-muted-foreground">Tour</span>
//                   <span className="font-medium">{booking.tourTitle}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-muted-foreground flex items-center gap-1">
//                     <Calendar className="h-3 w-3" />
//                     Date
//                   </span>
//                   <span className="font-medium">{formatDate(booking.date)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-muted-foreground flex items-center gap-1">
//                     <Clock className="h-3 w-3" />
//                     Time
//                   </span>
//                   <span className="font-medium">{formatTime(booking.date)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-muted-foreground flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     Guests
//                   </span>
//                   <span className="font-medium">{booking.guestCount} people</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Guide Details */}
//           {/* <Card>
//             <CardContent className="pt-6 space-y-4">
//               <h3 className="font-semibold">Guide Information</h3>
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage src={booking.guide?.profilePicture} />
//                   <AvatarFallback>
//                     {booking.guide?.name?.charAt(0) || 'G'}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h4 className="font-medium">{booking.guide?.name}</h4>
//                   <p className="text-sm text-muted-foreground">Local Guide</p>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="text-sm">
//                   <span className="text-muted-foreground">Languages: </span>
//                   <span>{booking.guide?.languages?.join(', ') || 'English'}</span>
//                 </div>
//                 {booking.guide?. && (
//                   <div className="flex items-center gap-1">
//                     <span className="text-sm text-muted-foreground">Rating: </span>
//                     <Badge variant="secondary">
//                       {/* ★ {booking.guide.rating.toFixed(1)} */}
//                       {/* ★ {booking.guide.rating.toFixed(1)}
//                     </Badge>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card> */} */
//           <Card>
//   <CardContent className="pt-6 space-y-4">
//     <h3 className="font-semibold">Guide Information</h3>
//     <div className="flex items-center gap-3">
//       <Avatar className="h-12 w-12">
//         <AvatarImage src={booking.guide?.profilePicture} />
//         <AvatarFallback>
//           {booking.guide?.name?.charAt(0) || 'G'}
//         </AvatarFallback>
//       </Avatar>
//       <div>
//         <h4 className="font-medium">{booking.guide?.name}</h4>
//         <p className="text-sm text-muted-foreground">Local Guide</p>
//       </div>
//     </div>
    
//     <div className="space-y-2">
//       <div className="text-sm">
//         <span className="text-muted-foreground">Email: </span>
//         <span>{booking.guide?.email}</span>
//       </div>

//       {/* যেহেতু আপনার ইন্টারফেসে languages নেই, তাই নিচের লাইনটি এরর দিতে পারে। 
//           যদি ব্যাকএন্ড ডাটা পাঠায় তবে ইন্টারফেসে languages: string[] অ্যাড করে নিন। */}
//       <div className="text-sm">
//         <span className="text-muted-foreground">Languages: </span>
//         <span>English, Bengali</span> {/* অথবা ইন্টারফেস আপডেট করে dynamic করুন */}
//       </div>

//       {/* Rating পার্ট ফিক্স (যদি ইন্টারফেসে rating না থাকে তবে এটি হাইড থাকাই ভালো) */}
//       {/* ইন্টারফেসে rating না থাকায় আপাতত হার্ডকোড বা কন্ডিশনাল করা হলো */}
//       <div className="flex items-center gap-1">
//         <span className="text-sm text-muted-foreground">Rating: </span>
//         <Badge variant="secondary">
//           ★ 4.8
//         </Badge>
//       </div>
//     </div>
//   </CardContent>
// </Card>
//         </div>

//         {/* Payment Details */}
//         <Card>
//           <CardContent className="pt-6 space-y-4">
//             <h3 className="font-semibold">Payment Details</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Base Price</span>
//                 <span>${booking.listing?.price?.toFixed(2) || '0.00'}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Guests</span>
//                 <span>× {booking.guestCount}</span>
//               </div>
//               <Separator />
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total Amount</span>
//                 <span className="text-primary">${booking.totalPrice.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground">Payment Status</span>
//                 <Badge variant={booking.paymentStatus === 'PAID' ? 'default' : 'outline'}>
//                   {booking.paymentStatus}
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap gap-3">
//           {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
//             <Button
//               variant="destructive"
//               onClick={handleCancelBooking}
//               disabled={isCancelling}
//             >
//               {isCancelling ? "Cancelling..." : "Cancel Booking"}
//             </Button>
//           )}

//           {booking.status === 'CONFIRMED' && booking.paymentStatus !== 'PAID' && (
//             <Button asChild>
//               <Link href={`/payment?bookingId=${booking.id}`}>
//                 Proceed to Payment
//               </Link>
//             </Button>
//           )}

//           {booking.status === 'COMPLETED' && !booking.reviewed && (
//             <Button onClick={() => setShowReviewForm(true)}>
//               Write a Review
//             </Button>
//           )}

//           <Button variant="outline" asChild>
//             <Link href={`/tourist/dashboard/listings/${booking.listing?.id}`}>
//               View Tour Details
//             </Link>
//           </Button>
//         </div>

//         {/* Review Form */}
//         {showReviewForm && (
//           <div className="border rounded-lg p-6">
//             <ReviewForm
//               bookingId={booking.id}
//               guideId={booking.guide?.id || booking.guide?.id}
//               onSuccess={() => {
//                 setShowReviewForm(false);
//                 router.refresh();
//               }}
//               onCancel={() => setShowReviewForm(false)}
//             />
//           </div>
//         )}

//         {/* Important Notes */}
//         {booking.status === 'PENDING' && (
//           <Card className="border-blue-200 bg-blue-50">
//             <CardContent className="pt-6">
//               <div className="flex items-start gap-3">
//                 <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
//                 <div className="space-y-2">
//                   <h4 className="font-semibold text-blue-800">Booking Pending</h4>
//                   <p className="text-sm text-blue-700">
//                     Your booking request has been sent to the guide. They will respond within 24 hours.
//                     You can cancel this request at any time before it's confirmed.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }