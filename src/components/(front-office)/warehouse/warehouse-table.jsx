"use client";

import { Input } from "@/components/ui/input";
import { useDeleteWarehouseMutation } from "@/api/(front-office)/warehouse/mutation";
import {
  useGetAllWarehouse,
  useGetSearchWarehouse,
} from "@/api/(front-office)/warehouse/queries";
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
import { WarehouseDialog } from "./warehouse-dialog";
import { WarehouseTableContent } from "./warehouse-table-content";
import Cookies from "js-cookie";

export function WarehouseTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allWarehouses, isLoading } = useGetAllWarehouse();
  const { data: searchedWarehouses } = useGetSearchWarehouse(debouncedSearch);
  const deleteWarehouse = useDeleteWarehouseMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState("");
  const [userRole, setUserRole] = useState("");

  // Check if user has admin privileges
  const hasAdminPrivileges = ["ADMIN_IT", "ADMIN"].includes(userRole);

  const warehouses = debouncedSearch ? searchedWarehouses : allWarehouses;

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

  const handleDeleteClick = (id_gudang) => {
    setWarehouseToDelete(id_gudang);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (warehouseToDelete) {
      deleteWarehouse.mutate(warehouseToDelete, {
        onSuccess: () => {
          setWarehouseToDelete("");
          setDeleteDialogOpen(false);
        },
        onError: (error) => {
          console.error("Failed to delete warehouse:", error);
        },
      });
    }
  };

  const totalItems = warehouses?.data?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = warehouses?.data?.slice(startIndex, endIndex) || [];

  // Message for no data found
  const noDataMessage = debouncedSearch
    ? "No warehouses found matching your search."
    : "No warehouses found.";

  useEffect(() => {
    if (warehouses?.data) {
      const hasManyItems = warehouses.data.length > 10;
      const hasLongContent = warehouses.data.some(
        (warehouse) =>
          (warehouse.id_gudang && warehouse.id_gudang.length > 20) ||
          (warehouse.nama_gudang && warehouse.nama_gudang.length > 30) ||
          (warehouse.keterangan && warehouse.keterangan.length > 50),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [warehouses]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search warehouses by Name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasAdminPrivileges && <WarehouseDialog />}
      </div>
      <div className="rounded-md border">
        <WarehouseTableContent
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
              warehouse{" "}
              <strong>
                &quot;
                {currentData.find(
                  (warehouse) => warehouse.id_gudang === warehouseToDelete,
                )?.nama_gudang || "selected warehouse"}
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
