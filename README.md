# Local Guide Platform - Frontend

A modern, responsive web application for connecting travelers with local expertise. Built with Next.js 15, this platform offers a seamless experience for both tourists and guides.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **State Management**: React Context API
- **Notifications**: [Sonner](https://sonner.stephanev.com/) / [React Hot Toast](https://react-hot-toast.com/)

## ✨ Key Features

### For Tourists
- **Explore Tours**: Search and filter tours by city, category, price, and language.
- **Tour Details**: view comprehensive tour information in a clean, interactive modal or dedicated page.
- **Booking System**: Request bookings for specific dates and guest counts.
- **Personal Dashboard**: Track booking status, history, and manage profile.

### For Guides
- **Listing Management**: Create, edit, and deactivate tour listings.
- **Quick View**: Preview listing details directly from the dashboard via a modern popup.
- **Booking Management**: View and manage incoming booking requests.
- **Analytics Dashboard**: Monitor earnings, active listings, and reviews.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- NPM / PNPM

### Installation
1. Clone the repository
2. Navigate to the frontend directory: `cd local-guide-frontend/my-app`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI and module-specific components.
- `/context`: Application-wide state (Auth, etc.).
- `/services`: API integration services.
- `/types`: TypeScript interfaces and types.
- `/lib`: Utility functions and configuration.

---
Built with ❤️ by the Local Guide Platform Team.
