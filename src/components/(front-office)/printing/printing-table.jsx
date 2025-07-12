"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Cookies from "js-cookie";
import {
  useGetAllPrinting,
  useSearchPrinting,
  useFilterPrinting,
} from "@/api/(front-office)/printing/queries";
import { useExportFilteredPrintingMutation } from "@/api/(front-office)/printing/mutation";
import { PrintingFilter } from "./printing-filter";
import { PrintingTableContent } from "./printing-table-content";
import { PrintingDialog } from "./printing-dialog";

export function PrintingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get user role from cookies
  const userRole = Cookies.get("role") || "";
  const isManager = userRole === "MANAGER";

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

  // Check if filters are active
  const hasActiveFilters = !!(filterParams.start_date && filterParams.end_date);

  // Determine which data to display
  const printing = hasActiveFilters
    ? filteredPrinting
    : debouncedSearch
      ? searchedPrinting
      : allPrinting;

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <PrintingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={exportFilteredPrinting.isPending}
        />

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              onClick={handleExportFilteredPrinting}
              disabled={exportFilteredPrinting.isPending}
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
              title="Export Filtered Printing"
            >
              <Download />
              <span className="hidden sm:inline">
                {exportFilteredPrinting.isPending
                  ? "Exporting..."
                  : "Export Filtered"}
              </span>
              <span className="sm:hidden">Export</span>
            </Button>
          )}
          {/* Hide PrintingDialog for manager role */}
          {!isManager && <PrintingDialog />}
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
        />
      </div>
    </div>
  );
}
