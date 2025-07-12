"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  useGetAllPacking,
  useSearchPacking,
  useFilterPacking,
} from "@/api/(front-office)/packing/queries";
import { useExportFilteredPackingMutation } from "@/api/(front-office)/packing/mutation";
import { PackingFilter } from "./packing-filter";
import { PackingTableContent } from "./packing-table-content";
import { PackingDialog } from "./packing-dialog";
import Cookies from "js-cookie";

export function PackingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API calls
  const { data: allPacking, isLoading: allPackingLoading } = useGetAllPacking();
  const { data: searchedPacking } = useSearchPacking(searchParams);
  const { data: filteredPacking, isLoading: filteredPackingLoading } =
    useFilterPacking(filterParams);
  const exportFilteredPacking = useExportFilteredPackingMutation();

  // Check if filters are active
  const hasActiveFilters = !!(filterParams.start_date && filterParams.end_date);

  // Determine which data to display
  const packing = hasActiveFilters
    ? filteredPacking
    : debouncedSearch
      ? searchedPacking
      : allPacking;

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
      });
    }
  };

  const handleExportFilteredPacking = () => {
    exportFilteredPacking.mutate(filterParams);
  };

  // Get user role from cookies
  const userRole = Cookies.get("role") || "";
  const isManager = userRole === "MANAGER";

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <PackingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={exportFilteredPacking.isPending}
        />

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              onClick={handleExportFilteredPacking}
              disabled={exportFilteredPacking.isPending}
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
              title="Export Filtered Packing"
            >
              <Download />
              <span className="hidden sm:inline">
                {exportFilteredPacking.isPending
                  ? "Exporting..."
                  : "Export Filtered"}
              </span>
              <span className="sm:hidden">Export</span>
            </Button>
          )}
          {/* Hide PackingDialog for manager role */}
          {!isManager && <PackingDialog />}
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
        />
      </div>
    </div>
  );
}
