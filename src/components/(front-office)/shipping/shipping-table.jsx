"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  useGetAllShipping,
  useSearchShipping,
  useFilterShipping,
} from "@/api/(front-office)/shipping/queries";
import { useExportFilteredShippingMutation } from "@/api/(front-office)/shipping/mutation";
import { ShippingFilter } from "./shipping-filter";
import { ShippingTableContent } from "./shipping-table-content";
import { ShippingDialog } from "./shipping-dialog";
import Cookies from "js-cookie";

export function ShippingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: allShipping, isLoading: allShippingLoading } =
    useGetAllShipping();
  const { data: searchedShipping } = useSearchShipping(debouncedSearch);
  const { data: filteredShipping, isLoading: filteredShippingLoading } =
    useFilterShipping(filterParams);
  const exportFilteredShipping = useExportFilteredShippingMutation();

  const hasActiveFilters = !!(filterParams.start_date && filterParams.end_date);

  const shipping = hasActiveFilters
    ? filteredShipping
    : debouncedSearch
      ? searchedShipping
      : allShipping;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const handleExportFilteredShipping = () => {
    exportFilteredShipping.mutate(filterParams);
  };

  const userRole = Cookies.get("role") || "";
  const isManager = userRole === "MANAGER";

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <ShippingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={exportFilteredShipping.isPending}
        />

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              onClick={handleExportFilteredShipping}
              disabled={exportFilteredShipping.isPending}
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
              title="Export Filtered Shipping"
            >
              <Download />
              <span className="hidden sm:inline">
                {exportFilteredShipping.isPending
                  ? "Exporting..."
                  : "Export Filtered"}
              </span>
              <span className="sm:hidden">Export</span>
            </Button>
          )}
          {!isManager && <ShippingDialog />}
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
        />
      </div>
    </div>
  );
}
