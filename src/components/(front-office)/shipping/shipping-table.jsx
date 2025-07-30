"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import {
  useGetAllShipping,
  useSearchShipping,
  useFilterShipping,
} from "@/api/(front-office)/shipping/queries";
import {
  useExportFilteredShippingMutation,
  useExportSelectedShippingMutation,
} from "@/api/(front-office)/shipping/mutation";
import { ShippingFilter } from "./shipping-filter";
import { ShippingTableContent } from "./shipping-table-content";
import { ShippingDialog } from "./shipping-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function ShippingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
    brand: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const prevShippingRef = useRef(null);
  const itemsPerPage = 10;

  // Get user role from cookies
  const userRole = Cookies.get("role") || "";
  const isManagerOrAdmin = userRole === "MANAGER" || userRole === "ADMIN";

  // API calls
  const { data: allShipping, isLoading: allShippingLoading } =
    useGetAllShipping();
  const { data: searchedShipping } = useSearchShipping(debouncedSearch);
  const { data: filteredShipping, isLoading: filteredShippingLoading } =
    useFilterShipping(filterParams);
  const exportFilteredShipping = useExportFilteredShippingMutation();
  const exportSelectedShipping = useExportSelectedShippingMutation();

  // Check if filters are active
  const hasActiveFilters =
    !!(filterParams.start_date && filterParams.end_date) ||
    !!filterParams.brand;

  // Check if we should show the Actions dropdown
  const showActionsDropdown = selectedIds.length > 0 || hasActiveFilters;

  // Determine which data to display
  const shipping = hasActiveFilters
    ? filteredShipping
    : debouncedSearch
      ? searchedShipping
      : allShipping;

  // Load selectedIds from localStorage
  useEffect(() => {
    const storedIds = localStorage.getItem("selectedShippingIds");
    if (storedIds) {
      setSelectedIds(JSON.parse(storedIds));
    }
  }, []);

  // Save selectedIds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedShippingIds", JSON.stringify(selectedIds));
  }, [selectedIds]);

  // Clear selections when shipping data changes
  useEffect(() => {
    if (
      prevShippingRef.current &&
      prevShippingRef.current !== shipping &&
      shipping?.data !== prevShippingRef.current?.data
    ) {
      setSelectedIds([]);
    }
    prevShippingRef.current = shipping;
  }, [shipping]);

  // Set up debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterParams]);

  const handleFilterChange = (params) => {
    setFilterParams(params);
    setSearchTerm("");
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    if (hasActiveFilters) {
      setFilterParams({
        start_date: "",
        end_date: "",
        brand: "",
      });
    }
  };

  const handleExportFilteredShipping = () => {
    exportFilteredShipping.mutate(filterParams);
  };

  const handleExportSelected = () => {
    if (selectedIds.length > 0) {
      exportSelectedShipping.mutate(selectedIds);
    }
  };

  const brandOptions = useMemo(() => {
    if (!allShipping?.data) return [];

    const uniqueBrands = new Map();

    // More comprehensive approach to find brands in the data structure
    allShipping.data.forEach((shipping) => {
      // Try multiple possible paths where brand info might exist

      // Path 1: through packing.pesanan
      if (shipping.packing?.pesanan?.pesanan_items?.length > 0) {
        shipping.packing.pesanan.pesanan_items.forEach((item) => {
          if (item.produk?.brand?.nama_brand) {
            uniqueBrands.set(item.produk.brand.nama_brand, {
              value: item.produk.brand.nama_brand,
              label: item.produk.brand.nama_brand,
            });
          }
        });
      }

      // Path 2: through packing.pencetakan_label.pesanan
      if (
        shipping.packing?.pencetakan_label?.pesanan?.pesanan_items?.length > 0
      ) {
        shipping.packing.pencetakan_label.pesanan.pesanan_items.forEach(
          (item) => {
            if (item.produk?.brand?.nama_brand) {
              uniqueBrands.set(item.produk.brand.nama_brand, {
                value: item.produk.brand.nama_brand,
                label: item.produk.brand.nama_brand,
              });
            }
          },
        );
      }
    });

    // Debug the brands found (remove in production)
    console.log("Found brands:", Array.from(uniqueBrands.values()));

    return Array.from(uniqueBrands.values());
  }, [allShipping]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <ShippingFilter
          brandOptions={brandOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={
            exportFilteredShipping.isPending || exportSelectedShipping.isPending
          }
        />

        <div className="flex items-center gap-2">
          {/* Only show Actions dropdown when there are actions available */}
          {showActionsDropdown && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                  size="sm"
                  disabled={
                    exportFilteredShipping.isPending ||
                    exportSelectedShipping.isPending
                  }
                >
                  <Download />
                  <span className="hidden sm:inline">Actions</span>
                  <span className="sm:hidden">Actions</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {selectedIds.length > 0 && (
                  <DropdownMenuItem
                    onClick={handleExportSelected}
                    disabled={exportSelectedShipping.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {exportSelectedShipping.isPending
                      ? "Exporting..."
                      : `Export Selected (${selectedIds.length})`}
                  </DropdownMenuItem>
                )}

                {hasActiveFilters && (
                  <DropdownMenuItem
                    onClick={handleExportFilteredShipping}
                    disabled={exportFilteredShipping.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {exportFilteredShipping.isPending
                      ? "Exporting..."
                      : "Export Filtered"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Hide import button for manager role */}
          {!userRole.includes("MANAGER") && <ShippingDialog />}
        </div>
      </div>

      <div className="rounded-md border">
        <ShippingTableContent
          shipping={shipping}
          isLoading={
            hasActiveFilters ? filteredShippingLoading : allShippingLoading
          }
          caption="A list of shipping records."
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </div>
    </div>
  );
}
