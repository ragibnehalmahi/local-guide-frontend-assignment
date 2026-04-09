// src/services/tourist/dashboard.service.ts
"use server"
import { serverFetch } from "@/lib/server-fetch";

export async function getTouristDashboardMetaData() {
  try {
    const response = await serverFetch.get("/tourist/dashboard/stats", {
      next: {
        tags: ["tourist-dashboard"],
        revalidate: 30,
      },
    });

    // ১. চেক করুন রেসপন্স ঠিক আছে কি না (Status 200-299)
    if (!response.ok) {
      const errorText = await response.text(); // JSON এর বদলে HTML আসলে তা টেক্সট হিসেবে ধরবে
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error("Failed to fetch dashboard data from server");
    }

    // ২. ডাটা পার্স করুন
    const result = await response.json();
    
    // ব্যাকএন্ডের ডাটা স্ট্রাকচার অনুযায়ী রিটার্ন করুন
    return {
      success: true,
      data: result.data, // আপনার ব্যাকএন্ড sendResponse ফাংশন ব্যবহার করলে ডাটা .data তে থাকে
    };

  } catch (error: any) {
    console.error("Error fetching tourist dashboard data:", error.message);
    
    // ৩. ফেইল করলে একটি ডিফল্ট অবজেক্ট রিটার্ন করুন যাতে UI ভেঙে না যায়
    return {
      success: false,
      data: {
        totalBookings: 0,
        upcomingTours: 0,
        completedTours: 0,
        totalSpent: 0,
        wishlistCount: 0,
        averageGuideRating: 0,
        recentBookings: []
      },
      message: error.message || "An unexpected error occurred",
    };
  }
}