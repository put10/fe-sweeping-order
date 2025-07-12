"use client";

import { useState, useEffect } from "react";
import { useDeleteCustomerMutation } from "@/api/(front-office)/customer/mutation";
import {
  useGetAllCustomer,
  useGetSearchCustomer,
} from "@/api/(front-office)/customer/queries";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomerDialog } from "./customer-dialog";
import { CustomerTableContent } from "./customer-table-content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Cookies from "js-cookie";

export function CustomerTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allCustomers, isLoading } = useGetAllCustomer();
  const { data: searchedCustomers } = useGetSearchCustomer(debouncedSearch);
  const deleteCustomer = useDeleteCustomerMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Check if user has the right privileges
  const hasCustomerAccess = userRole === "ORDER_STAFF" || userRole === "ADMIN";

  // Use search results if search term exists, otherwise use all customers
  const customers = debouncedSearch ? searchedCustomers : allCustomers;

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get user role from cookies
  useEffect(() => {
    setUserRole(Cookies.get("role") || "");
  }, []);

  useEffect(() => {
    if (customers?.data) {
      const hasManyItems = customers.data.length > 10;
      const hasLongContent = customers.data.some(
        (customer) =>
          (customer.id_pembeli && customer.id_pembeli.length > 20) ||
          (customer.nama_pembeli && customer.nama_pembeli.length > 30) ||
          (customer.alamat && customer.alamat.length > 40),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [customers]);

  const handleDeleteClick = (id_pembeli) => {
    setCustomerToDelete(id_pembeli);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteCustomer.mutate(
        { id_pembeli: customerToDelete },
        {
          onSuccess: () => {
            setCustomerToDelete("");
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            console.error("Failed to delete customer:", error);
          },
        },
      );
    }
  };

  const totalItems = customers?.data?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = customers?.data?.slice(startIndex, endIndex) || [];

  // Message for no data found
  const noDataMessage = debouncedSearch
    ? "No customers found matching your search."
    : "No customers found.";

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by Name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasCustomerAccess && <CustomerDialog />}
      </div>

      <div className="rounded-md border">
        <CustomerTableContent
          currentData={currentData}
          isLoading={isLoading}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          needsHorizontalScroll={needsHorizontalScroll}
          onDelete={handleDeleteClick}
          noDataMessage={noDataMessage}
          hasCustomerAccess={hasCustomerAccess}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer{" "}
              <strong>
                &quot;
                {currentData.find(
                  (customer) => customer.id_pembeli === customerToDelete,
                )?.nama_pembeli || "selected customer"}
                &quot;
              </strong>{" "}
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
