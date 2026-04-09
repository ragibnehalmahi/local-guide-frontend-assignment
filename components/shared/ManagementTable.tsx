"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortKey?: string;
  className?: string;
}

interface ManagementTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onStatusChange?: (item: T, newStatus: string) => Promise<void> | void;
  deleteLabel?: string | ((item: T) => string);
  getRowKey: (item: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  emptyMessage?: string;
  // getRowKey: (row: T) => string;
  
  className?: string;
}

export function ManagementTable<T>({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  getRowKey,
  emptyMessage = "No data found",
  className,
}: ManagementTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {hasActions && <TableHead className="w-20">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((column, index) => (
                  <TableCell key={index} className={column.className}>
                    {column.accessor(row)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(row)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { 
//   Eye, Edit, Trash2, MoreVertical, 
//   CheckCircle, XCircle, AlertCircle,
//   Search, Filter
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// interface Column<T> {
//   header: string;
//   accessor: (item: T) => React.ReactNode;
//   className?: string;
// }

// interface ManagementTableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   onView?: (item: T) => void;
//   onEdit?: (item: T) => void;
//   onDelete?: (item: T) => void;
//   onStatusChange?: (item: T, newStatus: string) => void;
//   deleteLabel?: string | ((item: T) => string);
//   getRowKey: (item: T) => string | number;
//   emptyMessage?: string;
//   searchable?: boolean;
//   searchPlaceholder?: string;
//   searchFields?: string[];
// }

// export default function ManagementTable<T>({
//   data,
//   columns,
//   onView,
//   onEdit,
//   onDelete,
//   onStatusChange,
//   deleteLabel = "Delete",
//   getRowKey,
//   emptyMessage = "No data found",
//   searchable = true,
//   searchPlaceholder = "Search...",
//   searchFields = [],
// }: ManagementTableProps<T>) {
//   const [search, setSearch] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState<string>("all");

//   // Filter data
//   const filteredData = data.filter((item) => {
//     // Search filter
//     if (search && searchFields.length > 0) {
//       const matchesSearch = searchFields.some((field) => {
//         const value = (item as any)[field];
//         return value && value.toString().toLowerCase().includes(search.toLowerCase());
//       });
//       if (!matchesSearch) return false;
//     }
    
//     // Status filter (if item has status property)
//     if (selectedStatus !== "all" && (item as any).status) {
//       return (item as any).status === selectedStatus;
//     }
    
//     return true;
//   });

//   // Get unique statuses for filter
//   const statuses = Array.from(
//     new Set(data.map(item => (item as any).status).filter(Boolean))
//   );

//   const getStatusBadge = (status: string) => {
//     const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
//       active: { label: "Active", variant: "default" },
//       inactive: { label: "Inactive", variant: "secondary" },
//       pending: { label: "Pending", variant: "outline" },
//       blocked: { label: "Blocked", variant: "destructive" },
//       approved: { label: "Approved", variant: "default" },
//       rejected: { label: "Rejected", variant: "destructive" },
//       completed: { label: "Completed", variant: "default" },
//       cancelled: { label: "Cancelled", variant: "secondary" },
//     };
    
//     const configItem = config[status.toLowerCase()] || { label: status, variant: "outline" as const };
    
//     return (
//       <Badge variant={configItem.variant} className="capitalize">
//         {configItem.label}
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-y-4">
//       {/* Filters */}
//       {(searchable || statuses.length > 0) && (
//         <div className="flex flex-col sm:flex-row gap-4">
//           {searchable && (
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder={searchPlaceholder}
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           )}
          
//           {statuses.length > 0 && (
//             <div className="flex gap-2">
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="border rounded-md px-3 py-2 text-sm bg-background"
//               >
//                 <option value="all">All Status</option>
//                 {statuses.map((status) => (
//                   <option key={status} value={status}>
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </option>
//                 ))}
//               </select>
//               <Button variant="outline" size="icon">
//                 <Filter className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Table */}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {columns.map((column, index) => (
//                 <TableHead key={index} className={column.className}>
//                   {column.header}
//                 </TableHead>
//               ))}
//               <TableHead className="w-[100px] text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredData.length > 0 ? (
//               filteredData.map((item) => (
//                 <TableRow key={getRowKey(item)}>
//                   {columns.map((column, colIndex) => (
//                     <TableCell key={colIndex} className={column.className}>
//                       {/* Special handling for status */}
//                       {(column.header.toLowerCase() === "status" && 
//                         typeof column.accessor(item) === "string") ? 
//                         getStatusBadge(column.accessor(item) as string) : 
//                         column.accessor(item)}
//                     </TableCell>
//                   ))}
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         {onView && (
//                           <DropdownMenuItem onClick={() => onView(item)}>
//                             <Eye className="mr-2 h-4 w-4" />
//                             View Details
//                           </DropdownMenuItem>
//                         )}
                        
//                         {onEdit && (
//                           <DropdownMenuItem onClick={() => onEdit(item)}>
//                             <Edit className="mr-2 h-4 w-4" />
//                             Edit
//                           </DropdownMenuItem>
//                         )}
                        
//                         {onStatusChange && (item as any).status && (
//                           <>
//                             {(item as any).status === "active" && (
//                               <DropdownMenuItem 
//                                 onClick={() => onStatusChange(item, "inactive")}
//                                 className="text-amber-600"
//                               >
//                                 <AlertCircle className="mr-2 h-4 w-4" />
//                                 Deactivate
//                               </DropdownMenuItem>
//                             )}
//                             {(item as any).status === "inactive" && (
//                               <DropdownMenuItem 
//                                 onClick={() => onStatusChange(item, "active")}
//                                 className="text-green-600"
//                               >
//                                 <CheckCircle className="mr-2 h-4 w-4" />
//                                 Activate
//                               </DropdownMenuItem>
//                             )}
//                             {(item as any).status === "pending" && (
//                               <>
//                                 <DropdownMenuItem 
//                                   onClick={() => onStatusChange(item, "approved")}
//                                   className="text-green-600"
//                                 >
//                                   <CheckCircle className="mr-2 h-4 w-4" />
//                                   Approve
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem 
//                                   onClick={() => onStatusChange(item, "rejected")}
//                                   className="text-red-600"
//                                 >
//                                   <XCircle className="mr-2 h-4 w-4" />
//                                   Reject
//                                 </DropdownMenuItem>
//                               </>
//                             )}
//                           </>
//                         )}
                        
//                         {onDelete && (
//                           <DropdownMenuItem 
//                             onClick={() => onDelete(item)}
//                             className="text-red-600"
//                           >
//                             <Trash2 className="mr-2 h-4 w-4" />
//                             {typeof deleteLabel === "function" 
//                               ? deleteLabel(item) 
//                               : deleteLabel}
//                           </DropdownMenuItem>
//                         )}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell 
//                   colSpan={columns.length + 1} 
//                   className="h-24 text-center"
//                 >
//                   <div className="flex flex-col items-center justify-center text-gray-500">
//                     <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
//                       <Search className="h-6 w-6 text-gray-400" />
//                     </div>
//                     <p className="font-medium">{emptyMessage}</p>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination Info */}
//       <div className="text-sm text-gray-500 flex justify-between items-center">
//         <span>
//           Showing {filteredData.length} of {data.length} items
//         </span>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="sm" disabled>
//             Previous
//           </Button>
//           <span className="px-3">Page 1 of 1</span>
//           <Button variant="outline" size="sm" disabled>
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }