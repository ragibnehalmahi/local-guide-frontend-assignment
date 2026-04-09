import UserManagement from "@/components/modules/Admin/UserManagement";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";

export default async function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600">Manage all users</p>
      </div>

      <Suspense fallback={<TableSkeleton columns={6} rows={8} />}>
        <UserManagement />
      </Suspense>
    </div>
  );
}



// import UsersFilter from "@/components/modules/Admin/UsersManagement/UsersFilter";
// import UsersTable from "@/components/modules/Admin/UsersManagement/UsersTable";
// import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
// import TablePagination from "@/components/shared/TablePagination";  
// import { TableSkeleton } from "@/components/shared/TableSkeleton";
// import { queryStringFormatter } from "@/lib/formatters";  
// import { getAllUsers } from "@/services/admin/admin.service";  
// import { Suspense } from "react";

// const AdminUsersManagementPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }) => {
//   const searchParamsObj = await searchParams;
//   const queryString = queryStringFormatter(searchParamsObj);
//   const usersResult = await getAllUsers(queryString);

//   const totalPages = Math.ceil(
//     (usersResult?.meta?.total || 1) / (usersResult?.meta?.limit || 10)
//   );

//   return (
//     <div className="space-y-6">
//       <ManagementPageHeader
//         title="Users Management"
//         description="Manage all users (Tourists, Guides, Admins)"
//       />

//       {/* Search, Filters */}
//       <UsersFilter />

//       <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
//         <UsersTable   users={usersResult?.data || []} />
//         <TablePagination
//           currentPage={usersResult?.meta?.page || 1}
//           totalPages={totalPages || 1}
//         />
//       </Suspense>
//     </div>
//   );
// };

// export default AdminUsersManagementPage;



// // src/app/(dashboardLayout)/(adminDashboardLayout)/dashboard/users/page.tsx
// import AdminUsers from "@/components/modules/Admin/AdminUsers";  
// import { getAllUsers } from "@/services/admin/admin.service";  
// import { IUser } from "@/types/user.interface";

// export default async function AdminUsersPage() {
//   const response = await getAllUsers();
//   const users: IUser[] = response?.data || [];

//   return (
//     <div className="space-y-6">
//       <AdminUsers initialUsers={users} />
//     </div>
//   );
// }