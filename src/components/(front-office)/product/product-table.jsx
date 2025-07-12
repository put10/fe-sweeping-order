"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  useGetAllProduct,
  useGetSearchProduct,
  useFilterProductByBrand,
} from "@/api/(front-office)/product/queries";
import { useDeleteProductMutation } from "@/api/(front-office)/product/mutation";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ProductDialog } from "./product-dialog";
import { ProductTableContent } from "./product-table-content";
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

export function ProductTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [brandFilterOpen, setBrandFilterOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  // Check if user has admin privileges
  const hasAdminPrivileges = userRole === "ADMIN_IT" || userRole === "ADMIN";

  const { data: allProducts, isLoading } = useGetAllProduct();
  const { data: searchedProducts } = useGetSearchProduct(debouncedSearch);
  const { data: filteredByBrandProducts } =
    useFilterProductByBrand(selectedBrandId);
  const deleteProduct = useDeleteProductMutation();

  // Extract unique brands from product data
  const brandOptions = useMemo(() => {
    if (!allProducts?.data) return [];

    const uniqueBrands = new Map();
    allProducts.data.forEach((product) => {
      if (product.brand) {
        uniqueBrands.set(product.brand.id_brand, {
          value: product.brand.id_brand,
          label: product.brand.nama_brand,
        });
      }
    });

    return Array.from(uniqueBrands.values());
  }, [allProducts]);

  // Determine which product dataset to use
  const products = useMemo(() => {
    if (selectedBrandId) return filteredByBrandProducts;
    if (debouncedSearch) return searchedProducts;
    return allProducts;
  }, [
    selectedBrandId,
    debouncedSearch,
    filteredByBrandProducts,
    searchedProducts,
    allProducts,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedBrandId]);

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
    if (products?.data) {
      const hasManyItems = products.data.length > 10;
      const hasLongContent = products.data.some(
        (product) =>
          (product.id_produk && product.id_produk.length > 20) ||
          (product.nama_produk && product.nama_produk.length > 30),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [products]);

  const handleDeleteClick = (id_produk) => {
    setProductToDelete(id_produk);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct.mutate(
        { id_produk: productToDelete },
        {
          onSuccess: () => {
            setProductToDelete("");
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

  // Pagination calculations
  const totalItems = products?.data?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = products?.data?.slice(startIndex, endIndex) || [];

  // Message for no data found
  const noDataMessage = selectedBrandId
    ? "No products found for selected brand."
    : debouncedSearch
      ? "No products found matching your search."
      : "No products found.";

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by Name or Category"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Popover open={brandFilterOpen} onOpenChange={setBrandFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={brandFilterOpen}
                className="w-[200px] justify-between"
                disabled={isLoading}
              >
                {selectedBrandId
                  ? brandOptions.find(
                      (brand) => brand.value === selectedBrandId,
                    )?.label || "Select brand..."
                  : "All brands"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search brand..." />
                <CommandList>
                  <CommandEmpty>No brand found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setSelectedBrandId("");
                        setBrandFilterOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          selectedBrandId === "" ? "opacity-100" : "opacity-0",
                        )}
                      />
                      All brands
                    </CommandItem>
                    {brandOptions.map((brand) => (
                      <CommandItem
                        key={brand.value}
                        value={brand.value}
                        onSelect={(currentValue) => {
                          setSelectedBrandId(currentValue);
                          setBrandFilterOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            selectedBrandId === brand.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {brand.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {hasAdminPrivileges && <ProductDialog />}
      </div>

      <div className="rounded-md border">
        <ProductTableContent
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
              product{" "}
              <strong>
                &quot;
                {products?.data?.find(
                  (prod) => prod.id_produk === productToDelete,
                )?.nama_produk || "selected product"}
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
