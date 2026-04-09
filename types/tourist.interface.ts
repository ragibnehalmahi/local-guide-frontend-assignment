// src/types/tourist.interface.ts
// export interface ITouristDashboardMeta {
//   totalBookings: number;
//   upcomingTours: number;
//   completedTours: number;
//   totalSpent: number;
//   wishlistCount: number;
//   averageGuideRating: number;
//   recentBookings: Array<{
//     _id: string;
//     tourTitle: string;
//     guideName: string;
//     date: string;
//     status: string;
//     totalPrice: number;
//   }>;
// }
// frontend/types/tourist.interface.ts
export interface ITouristDashboardMeta {
  totalBookings: number;
  totalSpent: number;
  upcomingTours: number;
  completedTours: number;
  wishlistCount: number;
  recentBookings: any[];
}
export interface ITourist {
  id: string;
  status: 'active' | 'blocked';
  createdAt: string;
  // অন্যান্য প্রপার্টি...
}