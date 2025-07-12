"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDeleteBrandMutation } from "@/api/(front-office)/brand/mutation";
import {
  useGetAllBrand,
  useGetSearchBrand,
} from "@/api/(front-office)/brand/queries";
import { Search } from "lucide-react";
import { BrandDialog } from "./brand-dialog";
import { BrandTableContent } from "./brand-table-content";
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

export function BrandTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allBrands, isLoading: allBrandsLoading } = useGetAllBrand();
  const { data: searchedBrands, isLoading: searchBrandsLoading } =
    useGetSearchBrand(debouncedSearch);
  const deleteBrand = useDeleteBrandMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userRole, setUserRole] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState("");

  // Use search results if search term exists, otherwise use all brands
  const brands = debouncedSearch ? searchedBrands : allBrands;
  const isLoading = debouncedSearch ? searchBrandsLoading : allBrandsLoading;

  // Check if user has admin privileges
  const hasAdminPrivileges = userRole === "ADMIN_IT" || userRole === "ADMIN";

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

  useEffect(() => {
    setUserRole(Cookies.get("role") || "");
  }, []);

  const handleDelete = (id_brand) => {
    setBrandToDelete(id_brand);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (brandToDelete) {
      deleteBrand.mutate(
        { id_brand: brandToDelete },
        {
          onSuccess: () => {
            setBrandToDelete("");
            setDeleteDialogOpen(false);
          },
        },
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brands by Name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasAdminPrivileges && <BrandDialog />}
      </div>

      <div className="rounded-md border">
        <BrandTableContent
          brands={brands}
          isLoading={isLoading}
          debouncedSearch={debouncedSearch}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          userRole={userRole}
          hasAdminPrivileges={hasAdminPrivileges}
          onDelete={handleDelete}
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
              brand{" "}
              <strong>
                &quot;
                {brands?.data?.find((brand) => brand.id_brand === brandToDelete)
                  ?.nama_brand || "selected brand"}
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
