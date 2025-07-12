"use client";

import { useState, useEffect } from "react";
import { useDeleteMarketplaceMutation } from "@/api/(front-office)/marketplace/mutation";
import {
  useGetAllMarketplaces,
  useGetSearchMarketplace,
} from "@/api/(front-office)/marketplace/queries";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MarketplaceDialog } from "./marketplace-dialog";
import { MarketplaceTableContent } from "./marketplace-table-content";
import Cookies from "js-cookie";
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

export function MarketplaceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allMarketplaces, isLoading } = useGetAllMarketplaces();
  const { data: searchedMarketplaces, isLoading: isSearchLoading } =
    useGetSearchMarketplace(debouncedSearch);
  const deleteMarketplace = useDeleteMarketplaceMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marketplaceToDelete, setMarketplaceToDelete] = useState("");

  // Check if user has marketplace admin privileges
  const hasMarketplaceAccess = userRole === "ADMIN_IT" || userRole === "ADMIN";

  // Use search results if search term exists, otherwise use all marketplaces
  const marketplaces = debouncedSearch ? searchedMarketplaces : allMarketplaces;
  const isTableLoading = debouncedSearch ? isSearchLoading : isLoading;

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

  const handleDeleteClick = (id_marketplace) => {
    setMarketplaceToDelete(id_marketplace);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (marketplaceToDelete) {
      deleteMarketplace.mutate(
        { id_marketplace: marketplaceToDelete },
        {
          onSuccess: () => {
            setMarketplaceToDelete("");
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

  const totalItems = marketplaces?.data?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = marketplaces?.data?.slice(startIndex, endIndex) || [];

  // Message for no data found
  const noDataMessage = debouncedSearch
    ? "No marketplaces found matching your search."
    : "No marketplaces found.";

  useEffect(() => {
    if (marketplaces?.data) {
      const hasManyItems = marketplaces.data.length > 10;
      const hasLongContent = marketplaces.data.some(
        (marketplace) =>
          (marketplace.id_marketplace &&
            marketplace.id_marketplace.length > 20) ||
          (marketplace.nama_marketplace &&
            marketplace.nama_marketplace.length > 30),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [marketplaces]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search marketplaces by Name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasMarketplaceAccess && <MarketplaceDialog />}
      </div>

      <div className="rounded-md border">
        <MarketplaceTableContent
          currentData={currentData}
          isLoading={isTableLoading}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          needsHorizontalScroll={needsHorizontalScroll}
          hasMarketplaceAccess={hasMarketplaceAccess}
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
              marketplace{" "}
              <strong>
                &quot;
                {marketplaces?.data?.find(
                  (marketplace) =>
                    marketplace.id_marketplace === marketplaceToDelete,
                )?.nama_marketplace || "selected marketplace"}
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
