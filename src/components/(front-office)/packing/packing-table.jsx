"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, Upload } from "lucide-react";
import Cookies from "js-cookie";
import {
  useGetAllPacking,
  useSearchPacking,
  useFilterPacking,
} from "@/api/(front-office)/packing/queries";
import {
  useExportFilteredPackingMutation,
  useExportSelectedPackingMutation,
  useImportPackingMutation,
} from "@/api/(front-office)/packing/mutation";
import { PackingFilter } from "./packing-filter";
import { PackingTableContent } from "./packing-table-content";
import { PackingDialog } from "./packing-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function PackingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
    brand: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const prevPackingRef = useRef(null);
  const fileInputRef = useRef(null);
  const itemsPerPage = 10;

  // Get user role from cookies
  const userRole = Cookies.get("role") || "";
  const isManagerOrAdmin = userRole === "MANAGER" || userRole === "ADMIN";

  // API calls
  const { data: allPacking, isLoading: allPackingLoading } = useGetAllPacking();
  const { data: searchedPacking } = useSearchPacking(searchParams);
  const { data: filteredPacking, isLoading: filteredPackingLoading } =
    useFilterPacking(filterParams);
  const exportFilteredPacking = useExportFilteredPackingMutation();
  const exportSelectedPacking = useExportSelectedPackingMutation();
  const importPacking = useImportPackingMutation();

  // Check if filters are active
  const hasActiveFilters =
    !!(filterParams.start_date && filterParams.end_date) ||
    !!filterParams.brand;

  // Check if we should show the Actions dropdown - only when there are actual actions to perform
  const showActionsDropdown = selectedIds.length > 0 || hasActiveFilters;

  // Determine which data to display
  const packing = hasActiveFilters
    ? filteredPacking
    : debouncedSearch
      ? searchedPacking
      : allPacking;

  // Load selectedIds from localStorage
  useEffect(() => {
    const storedIds = localStorage.getItem("selectedPackingIds");
    if (storedIds) {
      setSelectedIds(JSON.parse(storedIds));
    }
  }, []);

  // Save selectedIds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedPackingIds", JSON.stringify(selectedIds));
  }, [selectedIds]);

  // Clear selections when packing data changes
  useEffect(() => {
    if (
      prevPackingRef.current &&
      prevPackingRef.current !== packing &&
      packing?.data !== prevPackingRef.current?.data
    ) {
      setSelectedIds([]);
    }
    prevPackingRef.current = packing;
  }, [packing]);

  // Set up debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm) {
        setSearchParams({
          id_packing: searchTerm,
          id_pencetakan: searchTerm,
          id_pesanan: searchTerm,
        });
      } else {
        setSearchParams({});
      }
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
    setSearchParams({});
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

  const handleExportFilteredPacking = () => {
    exportFilteredPacking.mutate(filterParams);
  };

  const handleExportSelected = () => {
    if (selectedIds.length > 0) {
      exportSelectedPacking.mutate(selectedIds);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      importPacking.mutate(formData);
      e.target.value = "";
    }
  };

  const brandOptions = useMemo(() => {
    if (!allPacking?.data) return [];

    const uniqueBrands = new Map();
    allPacking.data.forEach((packing) => {
      if (packing.pencetakan_label?.pesanan?.pesanan_items?.length > 0) {
        packing.pencetakan_label.pesanan.pesanan_items.forEach((item) => {
          if (item.produk?.brand) {
            uniqueBrands.set(item.produk.brand.nama_brand, {
              value: item.produk.brand.nama_brand,
              label: item.produk.brand.nama_brand,
            });
          }
        });
      }
    });

    return Array.from(uniqueBrands.values());
  }, [allPacking]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <PackingFilter
          brandOptions={brandOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={
            exportFilteredPacking.isPending || exportSelectedPacking.isPending
          }
        />
        <div className="flex items-center gap-2">
          {/* Hide PackingDialog for non-manager/admin roles */}
          {isManagerOrAdmin && <PackingDialog />}

          {/* Only show Actions dropdown when there are actions available */}
          {showActionsDropdown && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                  size="sm"
                  disabled={
                    exportFilteredPacking.isPending ||
                    exportSelectedPacking.isPending
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
                    disabled={exportSelectedPacking.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {exportSelectedPacking.isPending
                      ? "Exporting..."
                      : `Export Selected (${selectedIds.length})`}
                  </DropdownMenuItem>
                )}

                {hasActiveFilters && (
                  <DropdownMenuItem
                    onClick={handleExportFilteredPacking}
                    disabled={exportFilteredPacking.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {exportFilteredPacking.isPending
                      ? "Exporting..."
                      : "Export Filtered"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <PackingTableContent
          packing={packing}
          isLoading={
            hasActiveFilters ? filteredPackingLoading : allPackingLoading
          }
          caption="A list of packing records."
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
