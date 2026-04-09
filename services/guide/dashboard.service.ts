"use server"
import { serverFetch } from "@/lib/server-fetch";

export async function getGuideDashboardMetaData() {
  try {
    // গাইডের জন্য নির্দিষ্ট এন্ডপয়েন্ট (আপনার ব্যাকএন্ড অনুযায়ী পাথ পরিবর্তন হতে পারে)
    const response = await serverFetch.get("/meta", {
      next: {
        tags: ["guide-dashboard"],
        revalidate: 30,
      },
    });

    // ১. চেক করুন রেসপন্স ঠিক আছে কি না (Status 200-299)
    if (!response.ok) {
      // যদি সার্ভার কোনো এরর দেয় (যেমন: Unauthorized বা 500)
      const errorText = await response.text(); 
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error("Failed to fetch guide dashboard data from server");
    }

    // ২. ডাটা পার্স করুন
    const result = await response.json();
    
    // ব্যাকএন্ডের ডাটা স্ট্রাকচার অনুযায়ী রিটার্ন করুন
    return {
      success: true,
      data: result.data, 
    };

  } catch (error: any) {
    console.error("Error fetching guide dashboard data:", error.message);
    
    // ৩. ফেইল করলে একটি ডিফল্ট অবজেক্ট রিটার্ন করুন যাতে UI ভেঙে না যায়
    // গাইডের জন্য প্রাসঙ্গিক ডিফল্ট ডাটা
    return {
      success: false,
      data: {
        totalListings: 0,
        totalBookings: 0,
        totalEarnings: 0,
        averageRating: 0,
        pendingBookings: 0,
        upcomingTours: 0,
        recentBookings: [] // গাইডের শেষ কয়েকটি বুকিং দেখানোর জন্য
      },
      message: error.message || "An unexpected error occurred",
    };
  }
}


// import { serverFetch } from "@/lib/server-fetch";

// export const getGuideDashboardMetaData = async () => {
//   try {
//     // নোট: আপনার ব্রাউজার থেকে কল করলে সরাসরি fetch কাজ করবে 
//     // যদি কুকি/টোকেন প্রয়োজন হয় তবে credentials: 'include' ঠিক আছে
//     const response = await serverFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/meta`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       // credentials: 'include' তখনই কাজ করবে যদি আপনার backend-এ CORS-এ 'allow-credentials' true থাকে
//       credentials: 'include', 
//       next: { tags: ['dashboard-meta'], revalidate: 60 }
//     });

//     const result = await response.json();

//     if (result.success && result.data) {
//       return {
//         success: true,
//         data: {
//           // ব্যাকএন্ড থেকে ডাটা মিসিং থাকলেও যেন অ্যাপ ক্র্যাশ না করে (Fallback)
//           totalListings: result.data.totalListings || 0,
//           totalBookings: result.data.totalBookings || 0,
//           totalEarnings: result.data.totalEarnings || 0,
//           averageRating: result.data.averageRating || 0,
//           pendingBookings: result.data.pendingBookings || 0,
//           upcomingTours: result.data.upcomingTours || 0,
//         }
//       };
//     }

//     // Success false হলে ডিফল্ট ডাটা রিটার্ন
//     return {
//       success: false,
//       data: defaultStats,
//       message: result.message || 'Failed to fetch'
//     };
    
//   } catch (error: any) {
//     console.error('Error fetching dashboard meta:', error);
//     return {
//       success: false,
//       data: defaultStats,
//       message: 'Network error or server is down'
//     };
//   }
// };

// // কোড ক্লিন রাখার জন্য ডিফল্ট ভ্যালু আলাদা করে রাখা
// const defaultStats = {
//   totalListings: 0,
//   totalBookings: 0,
//   totalEarnings: 0,
//   averageRating: 0,
//   pendingBookings: 0,
//   upcomingTours: 0,
// };


// // services/guide/dashboard.service.ts
// // import { API_BASE_URL } from '@/lib/config';

// export const getGuideDashboardMetaData = async () => {
//   try {
//     const response = await fetch(`http://localhost:5000/api/v1/meta`, {
//       credentials: 'include',
//       next: { tags: ['dashboard-meta'], revalidate: 60 }
//     });
    
//     const result = await response.json();
    
//     if (result.success) {
//       return {
//         success: true,
//         data: result.data
//       };
//     }
    
//     return {
//       success: false,
//       data: {
//         totalListings: 0,
//         totalBookings: 0,
//         totalEarnings: 0,
//         averageRating: 0,
//         pendingBookings: 0,
//         upcomingTours: 0
//       },
//       message: result.message
//     };
//   } catch (error: any) {
//     console.error('Error fetching dashboard meta:', error);
//     return {
//       success: false,
//       data: {
//         totalListings: 0,
//         totalBookings: 0,
//         totalEarnings: 0,
//         averageRating: 0,
//         pendingBookings: 0,
//         upcomingTours: 0
//       },
//       message: 'Failed to fetch dashboard data'
//     };
//   }
// };