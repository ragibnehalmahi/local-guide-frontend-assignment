// types/review.interface.ts
export interface IReview {
  _id: string;
  id: string;
  tourist: {
    _id: string;
    name: string;
    avatar?: string;
  };
  guide: {
    _id: string;
    name: string;
    avatar?: string;
  };
  booking: {
    _id: string;
    listingTitle: string;
    bookingDate: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICompletedBooking {
  _id: string;
  listing: {
    title: string;
    images: string[];
  };
  guide: {
    name: string;
    avatar?: string;
  };
  bookingDate: string;
  totalPrice: number;
  status: string;
}


// import { IBooking } from "./booking.interface";
// import { IUser } from "./user.interface";

// // export interface IReview {
// //   id: string;
// //   tourist: IUser;
// //   guide: IUser;
// //   booking: IBooking;
// //   rating: number;
// //   comment: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }
export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED'
}

// // export interface IReview {
// //   id: string;
// //   tourist: {
// //     id: string;
// //     name: string;
// //     profilePicture?: string;
// //   };
// //   guide: {
// //     id: string;
// //     name: string;
// //     profilePicture?: string;
// //   };
// //   booking: {
// //     id: string;
// //     tourTitle: string;
// //   };
// //   rating: number;
// //   comment: string;
// //   status: ReviewStatus;
// //   createdAt: string;
// //   updatedAt: string;
// // }
// export interface ICreateReviewPayload {
//   bookingId: string;
//   rating: number;
//   comment: string;
// }


// export interface IReview {
//   _id: string;
//   id: string;
//   booking: {
//     _id: string;
//     listingTitle: string;
//     bookingDate: string;
//   };
//   guide: {
//     _id: string;
//     name: string;
//     avatar?: string;
//   };
//   tourist: {
//     _id: string;
//     name: string;
//   };
//   rating: number; // 1-5
//   comment: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ICreateReview {
//   bookingId: string;
//   rating: number;
//   comment: string;
// }