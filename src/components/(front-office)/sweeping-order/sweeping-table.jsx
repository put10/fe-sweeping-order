"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  useGetAllSweepingOrders,
  useSearchSweepingOrder,
  useFilterSweepingOrder,
} from "@/api/(front-office)/sweeping-order/queries";
import { SweepingFilter } from "./sweeping-filter";
import { SweepingTableContent } from "./sweeping-table-content";
import { SweepingDialog } from "./sweeping-dialog";
import { SweepingExportFilter } from "./sweeping-export-filter";

export function SweepingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    status_proses: "",
    status_pesanan: "",
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get user role from cookies
  const userRole = Cookies.get("role") || "";
  const isRestrictedRole =
    userRole === "MANAGER" ||
    userRole === "WAREHOUSE_STAFF" ||
    userRole === "SHIPPING_STAFF";

  // API calls
  const { data: allSweepingOrders, isLoading: allSweepingOrdersLoading } =
    useGetAllSweepingOrders();
  const {
    data: searchedSweepingOrders,
    isLoading: searchedSweepingOrdersLoading,
  } = useSearchSweepingOrder(searchParams);
  const {
    data: filteredSweepingOrders,
    isLoading: filteredSweepingOrdersLoading,
  } = useFilterSweepingOrder(filterParams);

  // Check if filters are active
  const hasActiveFilters = !!(
    filterParams.status_proses ||
    filterParams.status_pesanan ||
    filterParams.start_date ||
    filterParams.end_date
  );
  const hasActiveSearch = !!(searchParams.id_proses || searchParams.id_pesanan);

  // Determine which data to display
  const sweepingOrder = hasActiveFilters
    ? filteredSweepingOrders
    : hasActiveSearch
      ? searchedSweepingOrders
      : allSweepingOrders;

  // Set up debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setSearchParams({
          id_proses: searchTerm,
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
  }, [searchParams, filterParams]);

  const handleFilterChange = (params) => {
    setFilterParams(params);
    setSearchTerm("");
    setSearchParams({});
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    if (hasActiveFilters) {
      setFilterParams({
        status_proses: "",
        status_pesanan: "",
        start_date: "",
        end_date: "",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SweepingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={false}
        />

        <div className="flex items-center gap-2">
          <SweepingExportFilter
            filterParams={filterParams}
            hasActiveFilters={hasActiveFilters}
          />
          {/* Hide SweepingDialog for manager role */}
          {!isRestrictedRole && <SweepingDialog />}
        </div>
      </div>

      <div className="rounded-md border">
        <SweepingTableContent
          sweepingOrder={sweepingOrder}
          isLoading={
            hasActiveFilters
              ? filteredSweepingOrdersLoading
              : hasActiveSearch
                ? searchedSweepingOrdersLoading
                : allSweepingOrdersLoading
          }
          caption="A list of sweeping order records."
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
