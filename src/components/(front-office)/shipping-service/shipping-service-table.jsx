"use client";

import { Input } from "@/components/ui/input";
import { useDeleteShippingServiceMutation } from "@/api/(front-office)/shipping-service/mutation";
import {
  useGetAllShippingServices,
  useGetSearchShippingService,
} from "@/api/(front-office)/shipping-service/queries";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
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
import { ShippingServiceDialog } from "./shipping-service-dialog";
import { ShippingServiceTableContent } from "./shipping-service-table-content";
import Cookies from "js-cookie";

export function ShippingServiceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allShippingServices, isLoading } = useGetAllShippingServices();
  const { data: searchedShippingServices } =
    useGetSearchShippingService(debouncedSearch);
  const deleteShippingService = useDeleteShippingServiceMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shippingServiceToDelete, setShippingServiceToDelete] = useState("");
  const [userRole, setUserRole] = useState("");

  // Check if user has admin privileges
  const hasAdminPrivileges = ["ADMIN_IT", "ADMIN"].includes(userRole);

  const shippingServices = debouncedSearch
    ? searchedShippingServices
    : allShippingServices;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

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

  const handleDeleteClick = (id_jasa) => {
    setShippingServiceToDelete(id_jasa);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (shippingServiceToDelete) {
      deleteShippingService.mutate(
        { id_jasa: shippingServiceToDelete },
        {
          onSuccess: () => {
            setShippingServiceToDelete("");
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            console.error("Failed to delete shipping service:", error);
          },
        },
      );
    }
  };

  const totalItems = shippingServices?.data?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = shippingServices?.data?.slice(startIndex, endIndex) || [];

  // Message for no data found
  const noDataMessage = debouncedSearch
    ? "No shipping services found matching your search."
    : "No shipping services found.";

  useEffect(() => {
    if (shippingServices?.data) {
      const hasManyItems = shippingServices.data.length > 10;
      const hasLongContent = shippingServices.data.some(
        (shippingService) =>
          (shippingService.id_jasa && shippingService.id_jasa.length > 20) ||
          (shippingService.nama_jasa && shippingService.nama_jasa.length > 30),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [shippingServices]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shipping services by Name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasAdminPrivileges && <ShippingServiceDialog />}
      </div>
      <div className="rounded-md border">
        <ShippingServiceTableContent
          currentData={currentData}
          isLoading={isLoading}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          needsHorizontalScroll={needsHorizontalScroll}
          hasAdminPrivileges={hasAdminPrivileges}
          onDelete={handleDeleteClick}
          noDataMessage={noDataMessage}
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
              shipping service{" "}
              <strong>
                &quot;
                {currentData.find(
                  (service) => service.id_jasa === shippingServiceToDelete,
                )?.nama_jasa || "selected shipping service"}
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
