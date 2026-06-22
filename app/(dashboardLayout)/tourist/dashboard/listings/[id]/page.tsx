// app/(dashboardLayout)/tourist/dashboard/listings/[id]/page.tsx
import TouristListingDetail from "@/components/modules/Tourist/TouristListingDetail";
import { getListingById } from "@/services/listing/listing.service";
import { notFound } from "next/navigation";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
   
  console.log("🔍 ListingDetailPage: params received:", params);

  const { id } = await params;
  console.log("🔍 Listing ID:", id);

 
  if (!id || id.length < 12) {
    console.error("❌ Invalid ID format:", id);
    
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Invalid Listing ID</h1>
        <p className="text-gray-600">The listing ID provided is not valid.</p>
      </div>
    );
  }

  try {
    const listingResult = await getListingById(id);
    console.log("✅ Listing result:", listingResult);

    if (!listingResult?.success || !listingResult.data) {
      console.error("❌ Listing not found or API error:", listingResult);
    
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Listing Not Found</h1>
          <p className="text-gray-600 mt-2">The tour you are looking for does not exist or has been removed.</p>
          <a href="/tourist/dashboard/listings" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Listings
          </a>
        </div>
      );
    }

    return <TouristListingDetail listing={listingResult.data} />;

  } catch (error: any) {
    console.error("🔥 Error fetching listing:", error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
        <p className="text-gray-600 mt-2">{error.message || "Failed to load listing details."}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Retry
        </button>
      </div>
    );
  }
}
