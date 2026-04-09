
'use server';
 import { UserRole } from './../../types/auth.interface';
// import { jwtDecode } from "jwt-decode";
 import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from '@/lib/zodValidator';  
import { registerPatientValidationZodSchema } from '@/zod/auth.validation';  
import { UserInfo } from "@/types/user.interface";
import { getCookie } from "../auth/tokenHandlers";
import { revalidate } from '@/lib/revalidate';
// import { jwt } from "zod";
 

/**
 * Handles patient registration process through Server Actions
 */
// export const register = async (prevState: any, formData: FormData): Promise<any> => {
//   try {
//     // 1. Extract raw data from FormData
//     const rawData = Object.fromEntries(formData.entries());
    
//     // 2. Validate input using Zod
//     const validationResult = zodValidator(rawData, registerPatientValidationZodSchema);

//     if (!validationResult.success) {
//       return {
//         success: false,
//         errors: validationResult.errors, // Assuming validator returns error details
//         message: "Invalid input data",
//       };
//     }

//     const { name, email, address, password } = validationResult.data;

//     // 3. Structure the data for API (Payload Construction)
//     const apiPayload = {
//       password,
//       patient: { name, email, address },
//     };

//     // 4. Prepare multi-part form data for server-to-server fetch
//     const multipartData = new FormData();
//     multipartData.append("data", JSON.stringify(apiPayload));

//     const profileImage = formData.get("file");
//     if (profileImage instanceof File && profileImage.size > 0) {
//       multipartData.append("file", profileImage);
//     }

//     // 5. API Request
//     const response = await serverFetch.post("/user/create-patient", {
//       body: multipartData,
//     });

//     const apiResult = await response.json();

//     // 6. Post-registration logic (Auto Login)
//     if (apiResult?.success) {
//       await loginUser(prevState, formData);
//       return apiResult;
//     }

//     return apiResult;

//   } catch (err: any) {
//     // Handle Next.js specific redirect errors correctly
//     if (err?.digest?.startsWith("NEXT_REDIRECT")) {
//       throw err;
//     }

//     console.error("Registration Error:", err);

//     return {
//       success: false,
//       message: process.env.NODE_ENV === "development" 
//         ? err.message 
//         : "Something went wrong during registration.",
//     };
//   }
// };

async function getAuthHeaders() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('accessToken')?.value;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getMyProfile() {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Failed to fetch profile',
      };
    }

    return {
      success: true,
      data: data.data,
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch profile',
    };
  }
}
 
export const getUserInfo = async (): Promise<UserInfo | any> => {
    try {
        const response = await serverFetch.get("/users/me", {
            next: { tags: ["user-info"], revalidate: 180 },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user from backend");
        }

        const result = await response.json();

        // যদি ব্যাকএন্ড ডাটা সফলভাবে দেয়, তাহলে টোকেন ভেরিফাই করার দরকার নেই।
        // কারণ serverFetch অলরেডি টোকেন নিয়ে গেছে এবং ব্যাকএন্ড সেটা ভেরিফাই করেই ডাটা দিয়েছে।
        if (result.success && result.data) {
            return {
                name: result.data.admin?.name || result.data.tourist?.name || result.data.guide?.name || result.data.name || "Unknown User",
                ...result.data
            };
        }
        
        throw new Error("User data not found");
    } catch (error: any) {
        console.error("getUserInfo Error:", error.message);
        return {
            id: "",
            name: "Unknown User",
            email: "",
            role: "tourist",
        };
    }
};
export async function updateMyProfile(formData: FormData) {
  try {
    const response = await serverFetch.patch("/users/update-profile", {
      method: 'PATCH',
      headers: {
        // DON'T set Content-Type for FormData - browser will set it automatically with boundary
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update profile error response:", errorText);
      throw new Error(`Failed: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { 
      success: false, 
      message: error.message || "Failed to update profile" 
    };
  }
}

export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/users?${queryParams.toString()}`, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Failed to fetch users',
      };
    }

    return {
      success: true,
      data: data.data,
      meta: data.meta,
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch users',
    };
  }
}

export async function updateUserStatus(userId: string, status: string) {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Failed to update user status',
      };
    }

    return {
      success: true,
      data: data.data,
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update user status',
    };
  }
}
 