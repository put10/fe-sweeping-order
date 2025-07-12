"use client";

import { useState, useEffect } from "react";
import { useGetAllCooperation } from "@/api/(front-office)/cooperation/queries";
import { useGetAllBrand } from "@/api/(front-office)/brand/queries";
import { useDeleteCooperationMutation } from "@/api/(front-office)/cooperation/mutation";
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
import { CooperationFilter } from "./cooperation-filter";
import { CooperationDialog } from "./cooperation-dialog";
import { CooperationTableContent } from "./cooperation-table-content";
import Cookies from "js-cookie";

export function CooperationTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({});
  const [userRole, setUserRole] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cooperationToDelete, setCooperationToDelete] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  // Check if user has admin privileges
  const hasAdminPrivileges = userRole === "CEO" || userRole === "ADMIN";

  const { data: allCooperations, isLoading } = useGetAllCooperation();
  const { data: brandsData } = useGetAllBrand();
  const deleteCooperation = useDeleteCooperationMutation();

  // Create brand options for filter
  const brandOptions =
    brandsData?.data?.map((brand) => ({
      value: brand.id_brand,
      label: brand.nama_brand,
    })) || [];

  // Filter cooperations based on search term and filters
  const filteredCooperations = allCooperations?.data?.filter((cooperation) => {
    // Search filter
    const matchesSearch =
      !debouncedSearch ||
      cooperation.nama_client
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      (cooperation.brand?.nama_brand &&
        cooperation.brand.nama_brand
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()));

    // Brand filter
    const matchesBrand =
      !filterParams.id_brand || cooperation.id_brand === filterParams.id_brand;

    // Date range filter
    let matchesDateRange = true;
    if (filterParams.start_date) {
      const cooperationDate = new Date(cooperation.tgl_mulai_kerjasama);
      const filterStartDate = new Date(filterParams.start_date);
      matchesDateRange = matchesDateRange && cooperationDate >= filterStartDate;
    }

    if (filterParams.end_date) {
      const cooperationEndDate = new Date(cooperation.tgl_akhir_kerjasama);
      const filterEndDate = new Date(filterParams.end_date);
      matchesDateRange =
        matchesDateRange && cooperationEndDate <= filterEndDate;
    }

    return matchesSearch && matchesBrand && matchesDateRange;
  });

  // Pagination calculations
  const totalItems = filteredCooperations?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredCooperations?.slice(startIndex, endIndex) || [];

  // Message for no data found
  const noDataMessage =
    debouncedSearch || Object.keys(filterParams).some((k) => filterParams[k])
      ? "No cooperations found matching your search or filters."
      : "No cooperations found.";

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterParams]);

  // Debounce search to avoid too many re-renders
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
    if (allCooperations?.data) {
      const hasManyItems = allCooperations.data.length > 10;
      const hasLongContent = allCooperations.data.some(
        (cooperation) =>
          cooperation.nama_client.length > 30 ||
          (cooperation.brand?.nama_brand &&
            cooperation.brand.nama_brand.length > 20),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [allCooperations]);

  const handleDeleteClick = (id_kerjasama) => {
    setCooperationToDelete(id_kerjasama);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (cooperationToDelete) {
      deleteCooperation.mutate(
        { id_kerjasama: cooperationToDelete },
        {
          onSuccess: () => {
            setCooperationToDelete("");
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            console.error("Delete error:", error);
            setDeleteDialogOpen(false);
          },
        },
      );
    }
  };

  return (
    <>
      {/* Filter and Search Component */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div className="w-full sm:max-w-sm mb-3 sm:mb-0">
          <CooperationFilter
            brandOptions={brandOptions}
            onFilterChange={setFilterParams}
            onSearchChange={setSearchTerm}
            searchTerm={searchTerm}
            disabled={isLoading}
          />
        </div>

        {hasAdminPrivileges && <CooperationDialog />}
      </div>

      <div className="rounded-md border">
        <CooperationTableContent
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              cooperation{" "}
              <strong>
                &quot;
                {filteredCooperations?.find(
                  (coop) => coop.id_kerjasama === cooperationToDelete,
                )?.nama_client || "selected cooperation"}
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
