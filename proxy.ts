import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';

// ১. ফাংশনটিকে 'proxy' নামে এক্সপোর্ট করুন
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get("accessToken")?.value || null;
    
    const secret = process.env.JWT_ACCESS_SECRET;
    let userRole: UserRole | null = null;

    if (accessToken) {
        try {
            if (!secret) {
                console.error("JWT_ACCESS_SECRET is missing!");
                return NextResponse.next();
            }
            const verifiedToken = jwt.verify(accessToken, secret) as JwtPayload;
            if (verifiedToken && typeof verifiedToken !== "string") {
                userRole = (verifiedToken.role as string).toLowerCase() as UserRole;
            }
        } catch (error) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete("accessToken");
            return response;
        }
    }

    const isAuth = isAuthRoute(pathname);
    const routerOwner = getRouteOwner(pathname);

    // লুপ বন্ধ করার লজিক
    if (accessToken && isAuth && userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
    }
    if (!accessToken && isAuth) return NextResponse.next();
    if (routerOwner === null) return NextResponse.next();

    if (!accessToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (routerOwner === "common") return NextResponse.next();

    if (userRole !== routerOwner) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    return NextResponse.next();
}

// ২. সবশেষে ডিফল্ট এক্সপোর্ট যোগ করুন (Turbopack এর জন্য এটি প্রয়োজন হতে পারে)
export default proxy;

// ৩. কনফিগারেশন
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};

//  import jwt, { JwtPayload } from 'jsonwebtoken';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
// import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';
// import { deleteCookie } from './services/auth/tokenHandlers';



// // This function can be marked `async` if using `await` inside
// export async function proxy(request: NextRequest) { // proxy ta call kothai korbo ? request ta kotha theke asche ? (support)
    
//     const pathname = request.nextUrl.pathname;

//     const accessToken = request.cookies.get("accessToken")?.value || null;

//     let userRole: UserRole | null = null;
//     if (accessToken) { // support
//         const verifiedToken: JwtPayload | string = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);

//         if (typeof verifiedToken === "string") {
//             deleteCookie("accessToken");
//             deleteCookie("refreshToken");
//             return NextResponse.redirect(new URL('/login', request.url));
//         }

//         userRole = verifiedToken.role;
//     }

//     const routerOwner = getRouteOwner(pathname);
//     //path = /doctor/appointments => "DOCTOR"
//     //path = /my-profile => "COMMON"
//     //path = /login => null

//     const isAuth = isAuthRoute(pathname)

//     // Rule 1 : User is logged in and trying to access auth route. Redirect to default dashboard
//     if (accessToken && isAuth) {
//         return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url))
//     }    


//     // Rule 2 : User is trying to access open public route
//     if (routerOwner === null) {
//         return NextResponse.next();
//     }

//     // Rule 1 & 2 for open public routes and auth routes

//     if (!accessToken) {
//         const loginUrl = new URL("/login", request.url);
//         loginUrl.searchParams.set("redirect", pathname);
//         return NextResponse.redirect(loginUrl);
//     }

//     // Rule 3 : User is trying to access common protected route
//     if (routerOwner === "common") {
//         return NextResponse.next();
//     }

//     // Rule 4 : User is trying to access role based protected route
//     if (routerOwner === "admin" || routerOwner === "tourist" || routerOwner === "guide") {
//         if (userRole !== routerOwner) {
//             return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url))
//         }
//     }
//     // console.log(userRole);

//     return NextResponse.next();
// }


//            //aita kokhon call hoi ? (support)
// export const config = {
//     matcher: [
//         /*
//          * Match all request paths except for the ones starting with:
//          * - api (API routes)
//          * - _next/static (static files)
//          * - _next/image (image optimization files)
//          * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//          */
//         '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
//     ],
// }