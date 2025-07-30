"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package2 } from "lucide-react";
import { useGetPackingReady } from "@/api/(front-office)/packing/queries";
import { useCreatePackingManyMutation } from "@/api/(front-office)/packing/mutation";
import { PackingFilter } from "./packing-filter";
import { PackingTableContentReady } from "./packing-table-content-ready";
import { toast } from "sonner";
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

export function PackingTableReady() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useState({});
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [packDialogOpen, setPackDialogOpen] = useState(false);

  // API calls
  const { data: readyOrders, isLoading: readyOrdersLoading } =
    useGetPackingReady();

  // Pack many mutation
  const createPackingMany = useCreatePackingManyMutation();

  // Check if filters are active
  const hasActiveFilters = !!(filterParams.start_date && filterParams.end_date);
  const hasActiveSearch = !!debouncedSearch;

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

  // Filter orders client-side by search term
  const filteredOrders =
    readyOrders && hasActiveSearch
      ? {
          ...readyOrders,
          data: readyOrders.data.filter(
            (order) =>
              order.id_pesanan
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase()) ||
              (order.pembeli?.nama_pembeli &&
                order.pembeli.nama_pembeli
                  .toLowerCase()
                  .includes(debouncedSearch.toLowerCase())),
          ),
        }
      : readyOrders;

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

  const handlePackAll = () => {
    if (
      !filteredOrders ||
      !filteredOrders.data ||
      filteredOrders.data.length === 0
    ) {
      toast.error("No orders available to pack");
      setPackDialogOpen(false);
      return;
    }

    // Extract order IDs from filtered orders
    const orderIds = filteredOrders.data.map((order) => order.id_pesanan);

    // Call the mutation with the array of order IDs
    createPackingMany.mutate({ id_pesanan: orderIds });
    setPackDialogOpen(false);
  };

  // Check if there's data to display
  const hasData = !readyOrdersLoading && filteredOrders?.data?.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <PackingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={createPackingMany.isPending}
          isPackingReady={true}
        />

        {/* Only render button when there's data */}
        {hasData && (
          <Button
            onClick={() => setPackDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Package2 className="h-4 w-4" />
            <span>Pack All Orders</span>
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <PackingTableContentReady
          orders={filteredOrders}
          isLoading={readyOrdersLoading}
          caption="Orders that need to be packed."
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <AlertDialog open={packDialogOpen} onOpenChange={setPackDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Packing All Orders</AlertDialogTitle>
            <AlertDialogDescription>
              This action will create packing records for{" "}
              {filteredOrders?.data?.length || 0} orders. Are you sure you want
              to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePackAll}
              disabled={createPackingMany.isPending}
            >
              {createPackingMany.isPending ? "Processing..." : "Pack All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
