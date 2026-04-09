"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export interface IBookingFormData {
  listingId: string;
  date: string;
  guestCount: number;
}

export async function createBooking(data: IBookingFormData) {
  try {
    const response = await serverFetch.post("/booking", {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag('listing-bookings', { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to create booking",
    };
  }
}

// export async function getMyBookings(queryString?: string) {
//   try {
//     const response = await serverFetch.get(
//       `/booking/my-booking${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`,
//       {
//         next: {
//           tags: ["my-booking"],
//           revalidate: 120,
//         },
//       }
//     );
    
//     const result = await response.json();
//     return result;
//   } catch (error: any) {
//     console.error("Error fetching bookings:", error);
//     return {
//       success: false,
//       data: [],
//       message:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Failed to fetch bookings",
//     };
//   }
// }
// export async function getMyBookings(queryString?: string) {
//   try {
//     const url = `/booking/my-booking${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`;
    
//     const response = await serverFetch.get(url, {
//       next: {
//         tags: ["my-booking"],
//         revalidate: 120,
//       },
//     });

//     // ১. চেক করুন রেসপন্স ঠিক আছে কি না
//     if (!response.ok) {
//       const errorContent = await response.text(); // HTML আসলে তা টেক্সট হিসেবে ধরবে
//       console.error(`Backend Error (${response.status}):`, errorContent);
//       throw new Error(`Server returned ${response.status}. Path might be wrong.`);
//     }

//     const result = await response.json();
//     return result;

//   } catch (error: any) {
//     console.error("Error fetching bookings:", error);
//     return {
//       success: false,
//       data: [],
//       message: error.message || "Failed to fetch bookings",
//     };
//   }
// }
// async getMyBookings(userId: Types.ObjectId, query: any = {}) {
//     try {
//       const {
//         page = 1,
//         limit = 10,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         status,
//         search,
//       } = query;

//       const skip = (page - 1) * limit;
//       const sortDirection = sortOrder === 'desc' ? -1 : 1;

//       // Build filter
//       // const filter: any = { tourist:  };
//  const filter :any ={tourist}
//       if (status) {
//         filter.status = status;
//       }

//       if (search) {
//         filter.$or = [
//           { 'listing.title': { $regex: search, $options: 'i' } },
//           { 'guide.name': { $regex: search, $options: 'i' } },
//         ];
//       }

//       // Get bookings with pagination
//       const bookings = await booking.find(filter)
//         .populate({
//           path: 'listing',
//           select: 'title images price duration',
//         })
//         .populate({
//           path: 'guide',
//           select: 'name profilePicture email phone',
//         })
//         .populate({
//           path: 'tourist',
//           select: 'name email',
//         })
//         .sort({ [sortBy]: sortDirection })
//         .skip(skip)
//         .limit(limit)
//         .lean();

//       // Get total count for pagination
//       const total = await bookings.countDocuments(filter);

//       // Calculate pagination info
//       const totalPages = Math.ceil(total / limit);
//       const hasNextPage = page < totalPages;
//       const hasPrevPage = page > 1;

//       return {
//         success: true,
//         data: bookings,
//         pagination: {
//           page: Number(page),
//           limit: Number(limit),
//           total,
//           totalPages,
//           hasNextPage,
//           hasPrevPage,
//         },
//       };
//     } catch (error) {
//       console.error('Error in getMyBookings:', error);
//       return {
//         success: false,
//         message: error instanceof Error ? error.message : 'Failed to fetch bookings',
//         data: [],
//         pagination: {
//           page: 1,
//           limit: 10,
//           total: 0,
//           totalPages: 0,
//           hasNextPage: false,
//           hasPrevPage: false,
//         },
//       };
//     }
//   }
export async function getMyBookings(queryString?: string) {
  try {
    const url = `/booking/my-bookings${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`;
    //                        ↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    //                  "my-bookings" (plural, no hyphen)

    const response = await serverFetch.get(url, {
      next: {
        tags: ["my-bookings"], // এটাও plural করো consistent হওয়ার জন্য
        revalidate: 120,
      },
    });

    if (!response.ok) {
      const errorContent = await response.text();
      console.error(`Backend Error (${response.status}):`, errorContent);
      throw new Error(`Server returned ${response.status}. Check API path.`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch bookings",
    };
  }
}
export async function getBookingsForGuide(queryString?: string) {
  try {
    const response = await serverFetch.get(
      `/booking/guide-bookings${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`,
      {
        next: {
          tags: ["guide-bookings"],
          revalidate: 120,
        },
      }
    );
    
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching guide bookings:", error);
    return {
      success: false,
      data: [],
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch guide bookings",
    };
  }
}

// export async function getBookingById(bookingId: string) {
//   try {
//     const response = await serverFetch.get(
//       `/booking/${bookingId}`,
//       {
//         next: {
//           tags: [`booking-${bookingId}`, "my-bookings", "guide-bookings"],
//           revalidate: 180,
//         },
//       }
//     );
    
//     const result = await response.json();
    
//     if (result.success) {
//       return {
//         success: true,
//         data: result.data,
//       };
//     }

//     return {
//       success: false,
//       data: null,
//       message: result.message || "Failed to fetch booking",
//     };
//   } catch (error: any) {
//     console.error("Error fetching booking:", error);
//     return {
//       success: false,
//       data: null,
//       message:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Failed to fetch booking",
//     };
//   }
// }
export async function getBookingById(bookingId: string) {
  if (!bookingId) {
    return { success: false, message: "Booking ID is required" };
  }

  try {
    const response = await serverFetch.get(`/booking/${bookingId}`, {
      next: {
        tags: [`booking-${bookingId}`, "my-bookings"],
        revalidate: 180,
      },
    });

    // ১. চেক করুন রেসপন্সটি JSON কি না
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType?.includes("application/json")) {
      console.error("Backend returned non-JSON or error status:", response.status);
      return { success: false, message: "Server error or Invalid Path" };
    }

    const result = await response.json();
    return result;

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch booking",
    };
  }
}
export async function confirmBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/confirm`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }
    
    return result;
  } catch (error: any) {
    console.error("Error confirming booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to confirm booking",
    };
  }
}

export async function declineBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/decline`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }
    
    return result;
  } catch (error: any) {
    console.error("Error declining booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to decline booking",
    };
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/cancel`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }
    
    return result;
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to cancel booking",
    };
  }
}

export async function completeBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/complete`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
      revalidateTag('guide-reviews', { expire: 0 });
    }
    
    return result;
  } catch (error: any) {
    console.error("Error completing booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to complete booking",
    };
  }
}
 

 
 

 

 