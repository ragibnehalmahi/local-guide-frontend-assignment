"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { cookies } from "next/dist/server/request/cookies";

// export async function initPayment(bookingId: string) {
//   try {
//     const response = await serverFetch.post("/payments/init", {
//       body: JSON.stringify({ bookingId }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();
//     return result;
//   } catch (error: any) {
//     console.error("Error initiating payment:", error);
//     return {
//       success: false,
//       message:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Failed to initiate payment",
//     };
//   }
// }
// export async function initPayment(bookingId: string) {
//   try {
//     const response = await serverFetch.post("/payments/init", {
      
//       body: JSON.stringify({ bookingId }),
//       headers: {
//       "Content-Type": "application/json",
//      },  
//     });

//     // রেসপন্স চেক করুন
//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to init payment");
//     }

//     const result = await response.json();
//     return result; // এখানে result.data.redirectUrl থাকতে হবে
//   } catch (error: any) {
//     console.error("Error initiating payment:", error);
//     return {
//       success: false,
//       message:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Failed to initiate payment",
//     };
//   }
// }

// export async function checkPaymentStatus(transactionId: string) {
//   try {
//     const response = await serverFetch.get(
//       `/payment/status?transactionId=${transactionId}`,
//       {
//         next: {
//           tags: [`payment-${transactionId}`],
//           revalidate: 30,
//         },
//       }
//     );
    
//     const result = await response.json();
    
//     if (result.success && result.data.status === 'PAID') {
//       revalidateTag('my-bookings', { expire: 0 });
//       revalidateTag('dashboard-meta', { expire: 0 });
//     }
    
//     return result;
//   } catch (error: any) {
//     console.error("Error checking payment status:", error);
//     return {
//       success: false,
//       data: null,
//       message:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Failed to check payment status",
//     };
//   }
// }

// export async function initPayment(bookingId: string) {
//   try {
//     const response = await serverFetch.post("/payments/init", {
//       body: JSON.stringify({ bookingId }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Failed to init payment");
//     }

//     const result = await response.json();
//     console.log("✅ Payment init result:", result);
//     return result;
    
//   } catch (error: any) {
//     console.error("❌ Error initiating payment:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to initiate payment",
//     };
//   }
// }
export async function initPayment(bookingId: string) {
  try {
    console.log("🔄 initPayment called for booking:", bookingId);
    
    // ✅ Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    if (!token) {
      console.error("❌ No access token found in cookies");
      return {
        success: false,
        message: "Please login first to make payment"
      };
    }
    
    console.log("🔑 Token found, length:", token.length);
    
    // ✅ Call API with token
    const response = await fetch("https://local-guide-backend-1-7iay.onrender.com/api/v1/payments/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // ✅ Token পাঠান
      },
      body: JSON.stringify({ bookingId }),
      credentials: "include",
    });

    console.log("📥 Response status:", response.status);
    
    const result = await response.json();
    console.log("✅ Payment init result:", result);
    
    return result;
    
  } catch (error: any) {
    console.error("❌ initPayment error:", error);
    
    return {
      success: false,
      message: error.message || "Failed to initiate payment",
    };
  }
}
export async function handlePaymentSuccess(transactionId: string, amount: string, status: string, val_id: string) {
  try {
    const response = await serverFetch.post(`https://local-guide-backend-1-7iay.onrender.com/api/v1/payments/success?tran_id=${transactionId}&amount=${amount}&status=${status}&val_id=${val_id}`);
    
    const result = await response.json();
    
    if (result.success) {
        // @ts-ignore: Ignoring type error related to the missing 'profile' argument, 
      revalidateTag("my-bookings");
      // @ts-ignore: Ignoring type error related to the missing 'profile' argument, 
      revalidateTag("guide-bookings");
    }
    
    return result;
  } catch (error: any) {
    console.error("Payment success callback error:", error);
    return {
      success: false,
      message: error.message || "Payment processing failed",
    };
  }
}



export async function checkPaymentStatus(transactionId: string) {
  try {
    const response = await serverFetch.get(
      `/payments/status?transactionId=${transactionId}`
    );
    
    const result = await response.json();
    
    if (result.success && result.data.status === 'PAID') {
      revalidateTag('my-bookings', { expire: 0 });
    }
    
    return result;
    
  } catch (error: any) {
    console.error("Error checking payment status:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to check payment status",
    };
  }
}