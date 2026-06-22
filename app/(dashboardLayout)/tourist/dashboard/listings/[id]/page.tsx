// app/(dashboardLayout)/tourist/dashboard/listings/[id]/page.tsx
import TouristListingDetail from "@/components/modules/Tourist/TouristListingDetail";
import { getListingById } from "@/services/listing/listing.service";
import { notFound } from "next/navigation";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

   
  if (!id || id.length < 12) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Invalid ID</h1>
        <p className="text-gray-600">The listing ID provided is not valid.</p>
        <a href="/tourist/dashboard/listings" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Listings
        </a>
      </div>
    );
  }

  const listingResult = await getListingById(id);

  
  if (!listingResult.success || !listingResult.data) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Listing Not Found</h1>
        <p className="text-gray-600 mt-2">{listingResult.message || "The tour you are looking for does not exist."}</p>
        <a href="/tourist/dashboard/listings" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Browse Tours
        </a>
      </div>
    );
  }

  return <TouristListingDetail listing={listingResult.data} />;
}
