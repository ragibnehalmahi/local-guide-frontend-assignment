'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { 
  getDefaultDashboardRoute, 
  isValidRedirectForRole,
   
  
} from '@/lib/auth-utils';
import { UserRole } from '@/types/auth.interface';
import { serverFetch } from '@/lib/server-fetch';
import { verifyAccessToken } from '@/lib/jwtHanlders';
 
 import { parse } from 'cookie';
import { revalidateTag } from 'next/cache';
// import { UserRole } from '@/types/user.interface';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://local-guide-backend-1-7iay.onrender.com/api/v1';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Cookie helpers
export async function setCookie(key: string, value: string, options?: any) {
  const cookieStore = cookies();
  (await cookieStore).set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...options,
  });
}

export async function getCookie(key: string) {
  const cookieStore = cookies();
  return (await cookieStore).get(key)?.value;
}

export async function deleteCookie(key: string) {
  const cookieStore = cookies();
  (await cookieStore).delete(key);
}

// Auth functions
// export async function loginUser(formData: FormData) {
//   try {
//     const email = formData.get('email') as string;
//     const password = formData.get('password') as string;
//     const redirectTo = formData.get('redirect') as string || '/';

//     // Validate input
//     const validation = loginSchema.safeParse({ email, password });
//     if (!validation.success) {
//       return {
//         success: false,
//         message: validation.error ,
//         errors: validation.error ,
//       };
//     }

//     // Call backend API
//     const response = await fetch(`${API_BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (!response.ok || !data.success) {
//       return {
//         success: false,
//         message: data.message || 'Login failed',
//       };
//     }

//     // Set cookies
//     await setCookie('accessToken', data.data.accessToken);
//     await setCookie('refreshToken', data.data.refreshToken);
    
//     // Store user info in a non-httpOnly cookie for client-side access
//     await setCookie('user', JSON.stringify(data.data.user), {
//       httpOnly: false,
//     });

//     // Get user role from token
//     const decoded = jwt.verify(data.data.accessToken, JWT_SECRET) as JwtPayload;
//     const UserRole = decoded.role as UserRole;

//     // Validate redirect path
//     let finalRedirect: string;
    
//     if (isValidRedirectForRole(redirectTo, UserRole.tourist) || isValidRedirectForRole(redirectTo, UserRole.GUIDE) || isValidRedirectForRole(redirectTo, UserRole.admin)) {
//       finalRedirect = redirectTo;
//     } else {
//       finalRedirect = getDefaultDashboardRoute(UserRole);
//     }

//     // Add login success parameter
//     const url = new URL(finalRedirect, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
//     url.searchParams.set('login', 'success');
    
//     redirect(url.toString());

//   } catch (error: any) {
//     console.error('Login error:', error);
//     return {
//       success: false,
//       message: error.message || 'Login failed',
//     };
//   }
// }
export async function loginUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirect') as string || '/';

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return {
        success: false,
        message: validation.error,
        errors: validation.error,
      };
    }

    // Call backend API
    const response = await fetch(`https://local-guide-backend-1-7iay.onrender.com/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }

    // Set cookies
    await setCookie('accessToken', data.data.accessToken);
    await setCookie('refreshToken', data.data.refreshToken);
    
    // Store user info in a non-httpOnly cookie for client-side access
    await setCookie('user', JSON.stringify(data.data.user), {
      httpOnly: false,
    });

    // Get user role from token  
    const decoded = jwt.verify(data.data.accessToken, JWT_SECRET) as JwtPayload;
    const userRole = decoded.role as UserRole; // Fixed: Renamed to userRole to avoid shadowing the enum

    // Validate redirect path
    let finalRedirect: string;
    
    // Fixed: Simplified to check if the redirect is valid for the user's specific role
    if (isValidRedirectForRole(redirectTo, userRole as any)) {
      finalRedirect = redirectTo;
    } else {
      finalRedirect = getDefaultDashboardRoute(userRole as any); // Fixed: Pass userRole instead of UserRole
    }

    // Add login success parameter
    const url = new URL(finalRedirect, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    url.searchParams.set('login', 'success');
    
    redirect(url.toString());

  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'Login failed',
    };
  }
}
export async function logoutUser() {
  try {
    const refreshToken = await getCookie('refreshToken');
    
    // 1. Notify backend logout
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (backendError) {
        console.error('Backend logout call failed:', backendError);
      }
    }

    // 2. Delete all auth cookies
    await deleteCookie('accessToken');
    await deleteCookie('refreshToken');
    await deleteCookie('user');
    await deleteCookie('userRole');

    // 3. Clear server cache tags
    revalidateTag("user-info", { expire: 0 });
    revalidateTag("me", { expire: 0 });
    revalidateTag("user", { expire: 0 });

  } catch (error) {
    console.error('Logout error:', error);
  }
}

export async function getCurrentUser() {
  try {
    const userCookie = await getCookie('user');
    if (!userCookie) return null;
    
    return JSON.parse(userCookie);
  } catch (error) {
    return null;
  }
}

export async function verifyToken() {
  try {
    const token = await getCookie('accessToken');
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// src/services/auth.service.ts

 

// export async function registerUser(userData: any) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/users/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         message: result.message || "Registration failed",
//       };
//     }

//     return {
//       success: true,
//       message: result.message || "Registration successful",
//       data: result.data,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: "Network error. Please try again.",
//     };
//   }
// }
export async function registerUser(prevState: any, formData: FormData) {
  try {
    // ১. FormData থেকে ডেটা বের করা
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    // ২. ডেটা চেক করা (বেসিক ভ্যালিডেশন)
    if (!name || !email || !password || !role) {
      return { success: false, message: "All fields are required" };
    }

    const payload = { name, email, password, role };

    // ৩. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো (আপনার API URL চেক করে নিন)
    const response = await fetch(`${API_BASE_URL }/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // ৪. JSON পার্স করার আগে রেসপন্স চেক করা
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    // ৫. রেজিস্ট্রেশন সফল হলে অটো-লগিন বা লগিন পেজে রিডাইরেক্ট
    // আপনি চাইলে সরাসরি লগিন পেজে পাঠাতে পারেন
    // redirect("/login?register=success"); 
    
    return {
      success: true,
      message: "Registration successful! Please login.",
      data: result.data,
    };

  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong. Please try again.",
    };
  }
}
// export async function updateMyProfile(formData: FormData) {
//   try {
//     // ✅ Direct backend call (সঠিক backend URL)
//     const response = await fetch("http://localhost:5000/api/v1/users/update-profile", {
//       method: "PATCH",
//       headers: {
//         // Content-Type দেবেন না, FormData automatic set করে
//       },
//       credentials: "include", // cookies পাঠাবে
//       body: formData, // সরাসরি FormData পাঠাবেন
//     });

//     const result = await response.json();

//     if (result.success) {
//       // ✅ Next.js এর cache clear করুন
//       fetch("/api/v1/revalidate?tag=user-info", { method: "POST" });
//     }
//     return result;
//   } catch (error: any) {
//     console.error("Update profile error:", error);
//     return { success: false, message: error.message };
//   }
// }
// export async function updateMyProfile(formData: FormData) {
//   try {
//     // নিশ্চিত করুন serverFetch আপনার ব্যাকএন্ডের BASE_URL ব্যবহার করছে
//     // এখানে কোনোভাবেই http://localhost:3000 (ফ্রন্টএন্ড পোর্ট) থাকবে না
//     const response = await serverFetch.patch(`/users/update-profile`, {
//       body: formData, 
//     });

//     const result = await response.json();

//     if (result.success) {
//        // ডাটা রিলোড করার জন্য এটি জরুরি
//        revalidateTag("user-info", { expire: 0 });
//     }
//     return result;
//   } catch (error: any) {
//     return { success: false, message: error.message };
//   }
// }
// export async function updateMyProfile(formData: FormData) {
//     try {
//         // Create a new FormData with the data property
//         const uploadFormData = new FormData();

//         // Get all form fields except the file
//         const data: any = {};
//         formData.forEach((value, key) => {
//             if (key !== 'file' && value) {
//                 data[key] = value;
//             }
//         });

//         // Add the data as JSON string
//         uploadFormData.append('data', JSON.stringify(data));

//         // Add the file if it exists
//         const file = formData.get('file');
//         if (file && file instanceof File && file.size > 0) {
//             uploadFormData.append('file', file);
//         }

//         const response = await serverFetch.patch(`/users/update-profile`, {
//             body: uploadFormData,
//         });

//         const result = await response.json();

//         if (result.success) {
//             revalidateTag("user-info", { expire: 0 });
//         }
//         return result;
//     } catch (error: any) {
//         console.log(error);
//         return {
//             success: false,
//             message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
//         };
//     }
// }
// export async function updateMyProfile(formData: FormData) {
//   try {
//     // ✅ সরাসরি backend URL
//     const response = await fetch("http://localhost:5000/api/v1/users/update-profile", {
//       method: "PATCH",
//       credentials: "include", // cookies পাঠাবে
//       body: formData, // সরাসরি FormData
//     });

//     const result = await response.json();

//     if (result.success) {
//       // ✅ Cache clear
//       fetch("/api/revalidate?tag=user-info", { method: "POST" });
      
//       // ✅ Local storage update
//       if (typeof window !== "undefined") {
//         const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
//         const updatedUser = { ...currentUser, ...result.data };
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       }
//     }
    
//     return result;
//   } catch (error: any) {
//     console.error("Update profile error:", error);
//     return { 
//       success: false, 
//       message: error.message || "Something went wrong" 
//     };
//   }
// }
// services/auth/auth.service.ts
export async function updateMyProfile(formData: FormData) {
  try {
    const response = await serverFetch.patch("/users/me", {
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      // Revalidate cache tags to refresh data
      revalidateTag("user-info", { expire: 0 });
      revalidateTag("me", { expire: 0 });
      revalidateTag("user", { expire: 0 });
    }
    
    return result;
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { 
      success: false, 
      message: error.message || "Something went wrong" 
    };
  }
}
// export async function updateMyProfile(formData: FormData) {
//   try {
//     const response = await serverFetch.patch(`/users/update-profile`, {
//       body: formData, // এখানে কোনো headers যোগ করবেন না
//     });

//     const result = await response.json();

//     if (result.success) {
//       revalidateTag("user-info", { expire: 0 });
//     }
//     return result;
//   } catch (error: any) {
//     console.error("Profile update error:", error);
//     return { success: false, message: error.message };
//   }
// }
// export async function updateMyProfile(formData: FormData,userId: string) {
//     try {
//         // এখানে সরাসরি formData ব্যাকএন্ডে পাঠিয়ে দিন অথবা আপনার নিয়ম অনুযায়ী প্রসেস করুন
//         const response = await serverFetch.patch(`/users/update-profile`, {
//             body: formData, // সরাসরি formData পাঠান
//         });

//         const result = await response.json();

//         if (result.success) {
//             revalidateTag("user-info", { expire: 0 });
//         }
//         return result;
//     } catch (error: any) {
//         return {
//             success: false,
//             message: error.message || 'Something went wrong'
//         };
//     }
// }
// export async function updateMyProfile(formData: FormData) {
//     try {
//         // Create a new FormData with the data property
//         const uploadFormData = new FormData();

//         // Get all form fields except the file
//         const data: any = {};
//         formData.forEach((value, key) => {
//             if (key !== 'file' && value) {
//                 data[key] = value;
//             }
//         });

//         // Add the data as JSON string
//         uploadFormData.append('data', JSON.stringify(data));

//         // Add the file if it exists
//         const file = formData.get('file');
//         if (file && file instanceof File && file.size > 0) {
//             uploadFormData.append('file', file);
//         }

//         const response = await serverFetch.patch(`/user/update-my-profile`, {
//             body: uploadFormData,
//         });

//         const result = await response.json();

//         if (result.success) {
//             revalidateTag("user-info", { expire: 0 });
//         }
//         return result;
//     } catch (error: any) {
//         console.log(error);
//         return {
//             success: false,
//             message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
//         };
//     }
// }
// Server action with role validation
export async function protectedAction(action: string, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    // Add your action logic here
    // Example: Update profile, create booking, etc.
    
    return {
      success: true,
      message: 'Action completed',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Action failed',
    };
  }
}
export async function getNewAccessToken() {
    try {
        const accessToken = await getCookie("accessToken");
        const refreshToken = await getCookie("refreshToken");

        //Case 1: Both tokens are missing - user is logged out
        if (!accessToken && !refreshToken) {
            return {
                tokenRefreshed: false,
            }
        }

        // Case 2 : Access Token exist- and need to verify
        if (accessToken) {
            const verifiedToken = await verifyAccessToken(accessToken);

            if (verifiedToken.success) {
                return {
                    tokenRefreshed: false,
                }
            }
        }

        //Case 3 : refresh Token is missing- user is logged out
        if (!refreshToken) {
            return {
                tokenRefreshed: false,
            }
        }

        //Case 4: Access Token is invalid/expired- try to get a new one using refresh token
        // This is the only case we need to call the API

        // Now we know: accessToken is invalid/missing AND refreshToken exists
        // Safe to call the API
        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;

        // API Call - serverFetch will skip getNewAccessToken for /auth/refresh-token endpoint
        const response = await serverFetch.post("/auth/refresh-token", {
            headers: {
                Cookie: `refreshToken=${refreshToken}`,
            },
        });

        const result = await response.json();


        const setCookieHeaders = response.headers.getSetCookie();

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {
                const parsedCookie = parse(cookie);

                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie;
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie;
                }
            })
        } else {
            throw new Error("No Set-Cookie header found");
        }

        if (!accessTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        if (!refreshTokenObject) {
            throw new Error("Tokens not found in cookies");
        }

        await deleteCookie("accessToken");
        await setCookie("accessToken", accessTokenObject.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60,
            path: accessTokenObject.Path || "/",
            sameSite: accessTokenObject['SameSite'] || "none",
        });

        await deleteCookie("refreshToken");
        await setCookie("refreshToken", refreshTokenObject.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 90,
            path: refreshTokenObject.Path || "/",
            sameSite: refreshTokenObject['SameSite'] || "none",
        });

        if (!result.success) {
            throw new Error(result.message || "Token refresh failed");
        }


        return {
            tokenRefreshed: true,
            success: true,
            message: "Token refreshed successfully"
        };


    } catch (error: any) {
        return {
            tokenRefreshed: false,
            success: false,
            message: error?.message || "Something went wrong",
        };
    }

}