"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useGetSweepingReady } from "@/api/(front-office)/sweeping-order/queries";
import { useCreateSweepingOrderManyMutation } from "@/api/(front-office)/sweeping-order/mutation";
import { SweepingFilter } from "./sweeping-filter";
import { SweepingOrderTableContentReady } from "./sweeping-order-table-content-ready";
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

export function SweepingOrderTableReady() {
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
  const [sweepDialogOpen, setSweepDialogOpen] = useState(false);

  // API calls
  const { data: readyOrders, isLoading: readyOrdersLoading } =
    useGetSweepingReady();

  // Sweep many mutation
  const createSweepingOrderMany = useCreateSweepingOrderManyMutation();

  // Check if filters are active
  const hasActiveFilters = !!(
    filterParams.status_proses ||
    filterParams.status_pesanan ||
    filterParams.start_date ||
    filterParams.end_date
  );
  const hasActiveSearch = !!(searchParams.id_proses || searchParams.id_pesanan);

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

  // Filter orders client-side by search term
  const filteredOrders =
    readyOrders && hasActiveSearch
      ? {
          ...readyOrders,
          data: readyOrders.data.filter(
            (order) =>
              (order.id_pesanan &&
                order.id_pesanan
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              (order.pembeli?.nama_pembeli &&
                order.pembeli.nama_pembeli
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())),
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
        status_proses: "",
        status_pesanan: "",
        start_date: "",
        end_date: "",
      });
    }
  };

  const handleSweepAll = () => {
    if (
      !filteredOrders ||
      !filteredOrders.data ||
      filteredOrders.data.length === 0
    ) {
      toast.error("No orders available to sweep");
      setSweepDialogOpen(false);
      return;
    }

    // Extract order IDs from filtered orders
    const orderIds = filteredOrders.data.map((order) => order.id_pesanan);

    // Call the mutation with the array of order IDs
    createSweepingOrderMany.mutate({ id_pesanan: orderIds });
    setSweepDialogOpen(false);
  };

  // Check if there's data to display
  const hasData = !readyOrdersLoading && filteredOrders?.data?.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SweepingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={createSweepingOrderMany.isPending}
          isSweepingReady={true}
        />

        {/* Only render button when there's data */}
        {hasData && (
          <Button
            onClick={() => setSweepDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>Sweep All Orders</span>
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <SweepingOrderTableContentReady
          orders={filteredOrders}
          isLoading={readyOrdersLoading}
          caption="Orders that need to be swept."
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <AlertDialog open={sweepDialogOpen} onOpenChange={setSweepDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sweeping All Orders</AlertDialogTitle>
            <AlertDialogDescription>
              This action will create sweeping records for{" "}
              {filteredOrders?.data?.length || 0} orders. Are you sure you want
              to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSweepAll}
              disabled={createSweepingOrderMany.isPending}
            >
              {createSweepingOrderMany.isPending
                ? "Processing..."
                : "Sweep All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
