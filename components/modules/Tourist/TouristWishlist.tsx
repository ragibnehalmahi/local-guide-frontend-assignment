"use client";

import { useState } from "react";
import { Heart, MapPin, Users, DollarSign, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { serverFetch } from "@/lib/server-fetch";
// import { api } from "@/lib/api";

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: {
    city: string;
    country: string;
  };
  category: string;
  durationHours: number;
  guide: {
    name: string;
  };
}

interface TouristWishlistProps {
  tours: Tour[];
}

export default function TouristWishlist({ tours }: TouristWishlistProps) {
  const [wishlist, setWishlist] = useState<Tour[]>(tours);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (tourId: string) => {
    setRemovingId(tourId);
    try {
      await serverFetch.delete(`/wishlist/${tourId}`);
      setWishlist(wishlist.filter(tour => tour.id !== tourId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-gray-600">Save tours for later</p>
      </div>

      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">Start exploring and add tours to your wishlist!</p>
            <Button asChild>
              <Link href="/tourist/dashboard/listings">Browse Tours</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((tour) => (
            <Card key={tour.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Image */}
                <div className="aspect-video relative">
                  <img
                    src={tour.images?.[0] || "/placeholder.jpg"}
                    alt={tour.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3">{tour.category}</Badge>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                    onClick={() => handleRemove(tour.id)}
                    disabled={removingId === tour.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{tour.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      {tour.location.city}, {tour.location.country}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      {tour.durationHours} hours • Guide: {tour.guide.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-2xl font-bold">
                      <DollarSign className="inline h-5 w-5" />
                      {tour.price}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/tourist/dashboard/listings/${tour.id}`}>
                          Details
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/tourist/dashboard/listings/${tour.id}`}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



// // src/components/modules/Tourist/TouristWishlist.tsx
// "use client";

// import { IListing } from "@/types/listing.interface";
// import { Trash2, MapPin, Star, Users, Calendar } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { removeFromWishlist } from "@/services/user/user.service";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function TouristWishlist({ listings }: { listings: IListing[] }) {
//   const router = useRouter();
//   const [removingId, setRemovingId] = useState<string | null>(null);

//   const handleRemoveFromWishlist = async (listingId: string) => {
//     setRemovingId(listingId);
//     try {
//       const result = await removeFromWishlist(listingId);
//       if (result.success) {
//         toast.success("Removed from wishlist");
//         router.refresh();
//       } else {
//         toast.error(result.message || "Failed to remove from wishlist");
//       }
//     } catch (error) {
//       toast.error("An error occurred");
//     } finally {
//       setRemovingId(null);
//     }
//   };

//   const handleClearAll = async () => {
//     if (!confirm("Are you sure you want to remove all items from your wishlist?")) {
//       return;
//     }

//     try {
//       // This would ideally be a batch remove endpoint
//       // For now, remove one by one
//       for (const listing of listings) {
//         await removeFromWishlist(listing.id);
//       }
//       toast.success("All items removed from wishlist");
//       router.refresh();
//     } catch (error) {
//       toast.error("Failed to clear wishlist");
//     }
//   };

//   if (listings.length === 0) {
//     return (
//       <div className="text-center py-12 border-2 border-dashed rounded-lg">
//         <div className="text-gray-400 mb-4">Your wishlist is empty</div>
//         <p className="text-sm text-gray-500 mb-6">
//           Start exploring tours and add them to your wishlist for later
//         </p>
//         <Button asChild>
//           <Link href="/tourist/dashboard/listings">
//             Explore Tours
//           </Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-lg font-semibold">My Wishlist</h2>
//           <p className="text-sm text-muted-foreground">
//             {listings.length} tour{listings.length !== 1 ? 's' : ''} saved
//           </p>
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleClearAll}
//           disabled={removingId !== null}
//         >
//           Clear All
//         </Button>
//       </div>

//       {/* Wishlist Items */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {listings.map((item) => (
//           <div key={item.id} className="group relative border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
//             {/* Image */}
//             <Link href={`/tourist/dashboard/listings/${item.id}`}>
//               <div className="h-48 overflow-hidden">
//                 <img
//                   src={item.images[0] || "/placeholder-image.jpg"}
//                   alt={item.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//             </Link>

//             {/* Remove Button */}
//             <button
//               onClick={() => handleRemoveFromWishlist(item.id)}
//               disabled={removingId === item.id}
//               className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors disabled:opacity-50"
//               title="Remove from wishlist"
//             >
//               <Trash2 className="h-4 w-4 text-red-500" />
//             </button>

//             {/* Price Badge */}
//             <Badge className="absolute top-3 left-3 bg-black/70 text-white backdrop-blur">
//               ${item.price}
//             </Badge>

//             {/* Content */}
//             <div className="p-4 space-y-3">
//               <Link href={`/tourist/dashboard/listings/${item.id}`}>
//                 <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-primary transition-colors">
//                   {item.title}
//                 </h3>
//               </Link>

//               <div className="space-y-2">
//                 <div className="flex items-center text-sm text-gray-500 gap-1">
//                   <MapPin className="h-3 w-3 flex-shrink-0" />
//                   <span className="line-clamp-1">
//                     {item.location.address}, {item.location.city}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-4 text-sm text-gray-500">
//                   <span className="flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     Max {item.maxGroupSize}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Calendar className="h-3 w-3" />
//                     {item.durationHours}h
//                   </span>
//                 </div>

//                 {item.guide?.rating && (
//                   <div className="flex items-center gap-1 text-sm">
//                     <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
//                     <span className="font-medium">{item.guide.rating.toFixed(1)}</span>
//                     <span className="text-gray-500 ml-1">({item.guide.totalReviews || 0} reviews)</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-2 pt-3 border-t">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   asChild
//                   className="flex-1"
//                 >
//                   <Link href={`/tourist/dashboard/listings/${item.id}`}>
//                     View Details
//                   </Link>
//                 </Button>
//                 <Button
//                   size="sm"
//                   asChild
//                   className="flex-1"
//                 >
//                   <Link href={`/tourist/dashboard/listings/${item.id}`}>
//                     Book Now
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Stats */}
//       <div className="border rounded-lg p-6 bg-muted/50">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="text-center">
//             <div className="text-2xl font-bold">{listings.length}</div>
//             <div className="text-sm text-muted-foreground">Total Tours</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold">
//               ${Math.min(...listings.map(l => l.price))}
//             </div>
//             <div className="text-sm text-muted-foreground">Lowest Price</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold">
//               ${Math.max(...listings.map(l => l.price))}
//             </div>
//             <div className="text-sm text-muted-foreground">Highest Price</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold">
//               {Math.round(listings.reduce((sum, l) => sum + (l.guide?.rating || 0), 0) / listings.length * 10) / 10 || 0}
//             </div>
//             <div className="text-sm text-muted-foreground">Avg Rating</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }