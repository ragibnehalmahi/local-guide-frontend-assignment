"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, MapPin, DollarSign, Globe, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { serverFetch } from "@/lib/server-fetch";
// import { api } from "@/lib/api";

interface Listing {
  _id: string;
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

interface TouristListingsProps {
  listings: Listing[];
  meta?: any;
}

export default function TouristListings({ listings, meta }: TouristListingsProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    category: "",
  });
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.city) params.set("city", filters.city);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.category) params.set("category", filters.category);
    
    router.push(`/tourist/dashboard/listings?${params.toString()}`);
  };

  const handleAddToWishlist = async (tourId: string) => {
    setWishlistLoading(tourId);
    try {
      await serverFetch.post(`/wishlist/${tourId}`);
      // Optional: Show success message
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    } finally {
      setWishlistLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Browse Tours</h1>
        <p className="text-gray-600">Find amazing local experiences</p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search tours..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Price</label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Price</label>
                <Input
                  type="number"
                  placeholder="$1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search Tours
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tours found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
          <Button onClick={() => {
            setFilters({ search: "", city: "", minPrice: "", maxPrice: "", category: "" });
            router.push("/tourist/dashboard/listings");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="aspect-video relative">
                    <img
                      src={listing.images?.[0] || "/placeholder.jpg"}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3">{listing.category}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      onClick={() => handleAddToWishlist(listing._id)}
                      disabled={wishlistLoading === listing._id}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{listing.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
  {/* Optional chaining (?.) ব্যবহার করা হয়েছে */}
  {listing?.location?.city || "Unknown City"}, {listing?.location?.country || "Unknown Country"}
</div>
                     <div className="flex items-center text-sm text-gray-600">
  <span className="mr-2">Guide:</span>
  {/* listing.guide এর পরে একটি ? চিহ্ন যোগ করা হয়েছে */}
  {listing?.guide?.name || "No guide assigned"}
</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>Duration:</span>
                        <span className="font-medium ml-2">{listing.durationHours} hours</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-2xl font-bold">
                        <DollarSign className="inline h-5 w-5" />
                        {listing.price}
                      </div>
                     <Button asChild>
  {/* listing._id বা listing.id চেক করুন কোনটি আপনার ডাটাতে আসছে */}
  <Link href={`/tourist/dashboard/listings/${listing._id  }`}>
    View Details
  </Link>
</Button>
<Button className="bg-green-600 hover:bg-green-700" asChild>
      <Link href={`/tourist/dashboard/listings/${listing._id}/book`}>
        Book Now
      </Link>
    </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.total > meta.limit && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" disabled={meta.page === 1}>
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
              </span>
              <Button variant="outline" disabled={meta.page >= Math.ceil(meta.total / meta.limit)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


// // src/components/modules/Tourist/TouristListings.tsx
// "use client";

// import { IListing } from "@/types/listing.interface";
// import { MapPin, Star, ArrowRight, Heart, Filter, User } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { searchListings } from "@/services/listing/listing.service";
// import { toast } from "sonner";
// import { ListingCategory } from "@/types/listing.interface";
// import { addToWishlist, removeFromWishlist } from "@/services/user/user.service";
// import { useRouter } from "next/navigation";
// import SearchFilters from "./SearchFilters";

// interface TouristListingsProps {
//   initialListings: IListing[];
// }

// export default function TouristListings({ initialListings }: TouristListingsProps) {
//   const router = useRouter();
//   const [listings, setListings] = useState<IListing[]>(initialListings);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [category, setCategory] = useState("");
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [sortBy, setSortBy] = useState("newest");
//   const [showFilters, setShowFilters] = useState(false);
//   const [wishlistIds, setWishlistIds] = useState<string[]>([]);

//   useEffect(() => {
//     // Fetch wishlist IDs on component mount
//     fetchWishlist();
//   }, []);

//   const fetchWishlist = async () => {
//     // Implement wishlist fetching logic
//     // This is a placeholder
//   };

//   const handleSearch = async (filters?: any) => {
//     setLoading(true);
//     try {
//       const searchFilters = filters || {
//         searchText: searchQuery,
//         category: category || undefined,
//         minPrice: priceRange[0],
//         maxPrice: priceRange[1],
//         sortBy
//       };

//       const response = await searchListings(searchFilters);
//       if (response.success) {
//         setListings(response.data || []);
//       } else {
//         toast.error("Failed to search listings");
//       }
//     } catch (error) {
//       toast.error("An error occurred while searching");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWishlistToggle = async (listingId: string, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     try {
//       if (wishlistIds.includes(listingId)) {
//         await removeFromWishlist(listingId);
//         setWishlistIds(prev => prev.filter(id => id !== listingId));
//         toast.success("Removed from wishlist");
//       } else {
//         await addToWishlist(listingId);
//         setWishlistIds(prev => [...prev, listingId]);
//         toast.success("Added to wishlist");
//       }
//     } catch (error) {
//       toast.error("Failed to update wishlist");
//     }
//   };

//   const handleClearFilters = () => {
//     setSearchQuery("");
//     setCategory("");
//     setPriceRange([0, 1000]);
//     setSortBy("newest");
//     handleSearch({
//       searchText: "",
//       category: "",
//       minPrice: 0,
//       maxPrice: 1000,
//       sortBy: "newest"
//     });
//   };

//   const sortListings = (listingsToSort: IListing[]) => {
//     switch (sortBy) {
//       case "price-low":
//         return [...listingsToSort].sort((a, b) => a.price - b.price);
//       case "price-high":
//         return [...listingsToSort].sort((a, b) => b.price - a.price);
//       case "rating":
//         return [...listingsToSort].sort((a, b) => (b.guide?.rating || 0) - (a.guide?.rating || 0));
//       default:
//         return listingsToSort;
//     }
//   };

//   const sortedListings = sortListings(listings);

//   return (
//     <div className="space-y-6">
//       {/* Search and Filter Bar */}
//       <div className="space-y-4">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Input
//               placeholder="Search tours by name, city, or description..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//               className="pl-10"
//             />
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
//               🔍
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setShowFilters(!showFilters)}
//               className="gap-2"
//             >
//               <Filter className="h-4 w-4" />
//               Filters
//             </Button>
//             <Button onClick={() => handleSearch()}>
//               Search
//             </Button>
//           </div>
//         </div>

//         {/* Quick Filters */}
//         <div className="flex flex-wrap gap-2">
//           <Select value={category} onValueChange={setCategory}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Categories</SelectItem>
//               {Object.values(ListingCategory).map((cat) => (
//                 <SelectItem key={cat} value={cat}>
//                   {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="newest">Newest First</SelectItem>
//               <SelectItem value="price-low">Price: Low to High</SelectItem>
//               <SelectItem value="price-high">Price: High to Low</SelectItem>
//               <SelectItem value="rating">Highest Rated</SelectItem>
//             </SelectContent>
//           </Select>

//           {(searchQuery || category || sortBy !== "newest") && (
//             <Button variant="ghost" onClick={handleClearFilters} className="text-sm">
//               Clear All
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Advanced Filters */}
//       {showFilters && (
//         <div className="border rounded-lg p-6">
//           <SearchFilters
//             onSearch={handleSearch}
//             initialFilters={{
//               city: "",
//               category,
//               minPrice: priceRange[0],
//               maxPrice: priceRange[1],
//               sortBy
//             }}
//           />
//         </div>
//       )}

//       {/* Results Count */}
//       <div className="flex justify-between items-center">
//         <div className="text-sm text-muted-foreground">
//           {listings.length} tour{listings.length !== 1 ? 's' : ''} found
//         </div>
//         <div className="text-sm">
//           <span className="text-muted-foreground">Sort by: </span>
//           <select 
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="bg-transparent border-none outline-none"
//           >
//             <option value="newest">Newest</option>
//             <option value="price-low">Price: Low to High</option>
//             <option value="price-high">Price: High to Low</option>
//             <option value="rating">Rating</option>
//           </select>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, i) => (
//             <div key={i} className="animate-pulse">
//               <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <>
//           {/* Listings Grid */}
//           {sortedListings.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {sortedListings.map((listing) => (
//                 <div
//                   key={listing.id}
//                   className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300"
//                 >
//                   <Link href={`/tourist/dashboard/listings/${listing.id}`}>
//                     <div className="relative">
//                       <div className="h-48 overflow-hidden">
//                         <img
//                           src={listing.images[0] || "/placeholder-image.jpg"}
//                           alt={listing.title}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         />
//                       </div>
                      
//                       {/* Wishlist Button */}
//                       <button
//                         onClick={(e) => handleWishlistToggle(listing.id, e)}
//                         className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
//                       >
//                         <Heart
//                           className={`h-5 w-5 ${
//                             wishlistIds.includes(listing.id)
//                               ? "fill-red-500 text-red-500"
//                               : "text-gray-600"
//                           }`}
//                         />
//                       </button>

//                       {/* Price Badge */}
//                       <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur">
//                         ${listing.price}
//                       </div>

//                       {/* Category Badge */}
//                       <Badge className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-gray-800">
//                         {listing.category}
//                       </Badge>
//                     </div>

//                     <div className="p-4 space-y-3">
//                       <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
//                         {listing.title}
//                       </h3>
                      
//                       <div className="flex items-center text-sm text-gray-500 gap-1">
//                         <MapPin className="h-3 w-3" />
//                         <span className="line-clamp-1">
//                           {listing.location.city}, {listing.location.country}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between pt-2">
//                         <div className="flex items-center gap-2">
//                           {listing.guide?.rating && (
//                             <>
//                               <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
//                               <span className="text-sm font-medium">
//                                 {listing.guide.rating.toFixed(1)}
//                               </span>
//                             </>
//                           )}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           <User className="inline h-3 w-3 mr-1" />
//                           Max {listing.maxGroupSize}
//                         </div>
//                       </div>

//                       <div className="pt-3 border-t">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-gray-500">
//                             {listing.durationHours} hours
//                           </span>
//                           <span className="inline-flex items-center gap-1 font-medium text-primary group-hover:gap-2 transition-all">
//                             View Details
//                             <ArrowRight className="h-3 w-3" />
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 border rounded-lg">
//               <div className="text-gray-400 mb-4">
//                 No tours found matching your criteria
//               </div>
//               <Button variant="outline" onClick={handleClearFilters}>
//                 Clear Filters
//               </Button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }