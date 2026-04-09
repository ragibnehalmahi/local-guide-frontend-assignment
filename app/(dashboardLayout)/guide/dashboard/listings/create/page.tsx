

// // Server Component
// import CreateListingForm from "@/components/modules/Guide/CreateListingForm";
// import { Card, CardContent } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export default function CreateListingPage() {
//   return (
//     <div className="container max-w-4xl mx-auto py-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/dashboard/guide/listings">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back to Listings
//               </Link>
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold">Create New Tour</h1>
//               <p className="text-gray-500">
//                 Share your local expertise with travelers from around the world
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main Form */}
//         <Card>
//           <CardContent className="p-6">
//             <CreateListingForm />
//           </CardContent>
//         </Card>

//         {/* Footer Note */}
//         <div className="text-center text-sm text-gray-500">
//           <p>Your listing will be reviewed within 24 hours before going live.</p>
//           <p className="mt-1">
//             Need help? <Link href="/guide-support" className="text-blue-600 hover:underline">
//               Contact Guide Support
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

 
  

import Link, { LinkProps } from "next/link";
 
import  CreateListingForm  from  "@/components/modules/Guide/CreateListingForm";
export default function CreateListingPage() {
  return (
    <div style={{ padding: "20px" }}>
      <Link href="/guide/dashboard/listings">
        ← Back to Listings
      </Link>
      
      <h1 style={{ fontSize: "24px", margin: "20px 0" }}>
        Create New Listing
      </h1>

      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <CreateListingForm/>
      </div>
    </div>
  );
}