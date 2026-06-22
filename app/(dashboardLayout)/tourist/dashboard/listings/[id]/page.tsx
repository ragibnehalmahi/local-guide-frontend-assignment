// app/(dashboardLayout)/tourist/dashboard/listings/[id]/page.tsx
import TouristListingDetail from "@/components/modules/Tourist/TouristListingDetail";
import { getListingById } from "@/services/listing/listing.service";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;

  

  try {
    const listingResult = await getListingById(id);

    if (!listingResult?.success || !listingResult.data) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">Tour Not Found</h1>
          <p className="text-gray-600 mt-2">The tour you are looking for does not exist.</p>
          <a href="/tourist/dashboard/listings" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Browse Tours
          </a>
        </div>
      );
    }

    return <TouristListingDetail listing={listingResult.data} />;
    
  } catch (error: any) {
    console.error("🔥 Error in detail page:", error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    );
  }
}
