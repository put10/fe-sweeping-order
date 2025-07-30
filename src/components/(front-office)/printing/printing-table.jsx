"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import {
  useGetAllPrinting,
  useSearchPrinting,
  useFilterPrinting,
} from "@/api/(front-office)/printing/queries";
import {
  useExportFilteredPrintingMutation,
  useExportSelectedPrintingMutation,
} from "@/api/(front-office)/printing/mutation";
import { PrintingFilter } from "./printing-filter";
import { PrintingTableContent } from "./printing-table-content";
import { PrintingDialog } from "./printing-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function PrintingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const prevPrintingRef = useRef(null);
  const itemsPerPage = 10;

  // Get user role from cookies
  const userRole = Cookies.get("role") || "";
  const isManagerOrAdmin = userRole === "MANAGER" || userRole === "ADMIN";

  // API calls
  const { data: allPrinting, isLoading: allPrintingLoading } =
    useGetAllPrinting();
  const { data: searchedPrinting } = useSearchPrinting({
    id_pencetakan: debouncedSearch,
    id_pesanan: debouncedSearch,
  });
  const { data: filteredPrinting, isLoading: filteredPrintingLoading } =
    useFilterPrinting(filterParams);
  const exportFilteredPrinting = useExportFilteredPrintingMutation();
  const exportSelectedPrinting = useExportSelectedPrintingMutation();

  // Check if filters are active
  const hasActiveFilters = !!(filterParams.start_date && filterParams.end_date);

  // Check if we should show the Actions dropdown
  const showActionsDropdown = selectedIds.length > 0 || hasActiveFilters;

  // Determine which data to display
  const printing = hasActiveFilters
    ? filteredPrinting
    : debouncedSearch
      ? searchedPrinting
      : allPrinting;

  // Load selectedIds from localStorage
  useEffect(() => {
    const storedIds = localStorage.getItem("selectedPrintingIds");
    if (storedIds) {
      setSelectedIds(JSON.parse(storedIds));
    }
  }, []);

  // Save selectedIds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedPrintingIds", JSON.stringify(selectedIds));
  }, [selectedIds]);

  // Clear selections when printing data changes
  useEffect(() => {
    if (
      prevPrintingRef.current &&
      prevPrintingRef.current !== printing &&
      printing?.data !== prevPrintingRef.current?.data
    ) {
      setSelectedIds([]);
    }
    prevPrintingRef.current = printing;
  }, [printing]);

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
      });
    }
  };

  const handleExportFilteredPrinting = () => {
    exportFilteredPrinting.mutate(filterParams);
  };

  const handleExportSelected = () => {
    if (selectedIds.length > 0) {
      exportSelectedPrinting.mutate(selectedIds);
    }
  };

  const brandOptions = useMemo(() => {
    if (!allPrinting?.data) return [];

    const uniqueBrands = new Map();
    allPrinting.data.forEach((printing) => {
      if (printing.pesanan?.pesanan_items?.length > 0) {
        printing.pesanan.pesanan_items.forEach((item) => {
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
  }, [allPrinting]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <PrintingFilter
          brandOptions={brandOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={
            exportFilteredPrinting.isPending || exportSelectedPrinting.isPending
          }
        />

        <div className="flex items-center gap-2">
          {/* Hide PrintingDialog for manager role */}
          {isManagerOrAdmin && <PrintingDialog />}
          {/* Only show Actions dropdown when there are actions available */}
          {showActionsDropdown && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                  size="sm"
                  disabled={
                    exportFilteredPrinting.isPending ||
                    exportSelectedPrinting.isPending
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
                    disabled={exportSelectedPrinting.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {exportSelectedPrinting.isPending
                      ? "Exporting..."
                      : `Export Selected (${selectedIds.length})`}
                  </DropdownMenuItem>
                )}

                {hasActiveFilters && (
                  <DropdownMenuItem
                    onClick={handleExportFilteredPrinting}
                    disabled={exportFilteredPrinting.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {exportFilteredPrinting.isPending
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
        <PrintingTableContent
          printing={printing}
          isLoading={
            hasActiveFilters ? filteredPrintingLoading : allPrintingLoading
          }
          caption="A list of printing records."
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
