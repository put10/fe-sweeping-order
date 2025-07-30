"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { useGetShippingReady } from "@/api/(front-office)/shipping/queries";
import { useCreateShippingManyMutation } from "@/api/(front-office)/shipping/mutation";
import { ShippingFilter } from "./shipping-filter";
import { ShippingTableContentReady } from "./shipping-table-content-ready";
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

export function ShippingTableReady() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [shipDialogOpen, setShipDialogOpen] = useState(false);

  // API calls
  const { data: readyOrders, isLoading: readyOrdersLoading } =
    useGetShippingReady();

  // Ship many mutation
  const createShippingMany = useCreateShippingManyMutation();

  // Set up debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterParams]);

  // Filter orders client-side by search term
  const filteredOrders =
    readyOrders && debouncedSearch
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
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    if (filterParams.start_date || filterParams.end_date) {
      setFilterParams({
        start_date: "",
        end_date: "",
      });
    }
  };

  const handleShipAll = () => {
    if (
      !filteredOrders ||
      !filteredOrders.data ||
      filteredOrders.data.length === 0
    ) {
      toast.error("No orders available to ship");
      setShipDialogOpen(false);
      return;
    }

    // Extract order IDs from filtered orders
    const orderIds = filteredOrders.data.map((order) => order.id_pesanan);

    // Call the mutation with the array of order IDs
    createShippingMany.mutate({ id_pesanan: orderIds });
    setShipDialogOpen(false);
  };

  // Check if there's data to display
  const hasData = !readyOrdersLoading && filteredOrders?.data?.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <ShippingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={createShippingMany.isPending}
          isShippingReady={true}
        />
        {/* Only render button when there's data */}
        {hasData && (
          <Button
            onClick={() => setShipDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Truck className="h-4 w-4" />
            <span>Ship All Orders</span>
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <ShippingTableContentReady
          orders={filteredOrders}
          isLoading={readyOrdersLoading}
          caption="Orders that need to be shipped."
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <AlertDialog open={shipDialogOpen} onOpenChange={setShipDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Shipping All Orders</AlertDialogTitle>
            <AlertDialogDescription>
              This action will create shipping records for{" "}
              {filteredOrders?.data?.length || 0} orders. Are you sure you want
              to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleShipAll}
              disabled={createShippingMany.isPending}
            >
              {createShippingMany.isPending ? "Processing..." : "Ship All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
