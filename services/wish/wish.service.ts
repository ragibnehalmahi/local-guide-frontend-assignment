import { serverFetch } from "@/lib/server-fetch";

// ইউজারের উইশলিস্টে থাকা সব ট্যুর আনার জন্য
export const getWishlist = async () => {
  try {
    const response = await serverFetch.get(`/wishlists`, {
      next: {
        tags: ["wishlist"],
      },
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, data: [], message: "Failed to fetch wishlist" };
  }
};