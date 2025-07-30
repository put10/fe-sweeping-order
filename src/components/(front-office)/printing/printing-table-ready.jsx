"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useGetPrintingReady } from "@/api/(front-office)/printing/queries";
import { useCreatePrintingManyMutation } from "@/api/(front-office)/printing/mutation";
import { PrintingFilter } from "./printing-filter";
import { PrintingTableContentReady } from "./printing-table-content-ready";
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

export function PrintingTableReady() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  // API calls
  const { data: readyOrders, isLoading: readyOrdersLoading } =
    useGetPrintingReady();

  // Print many mutation
  const createPrintingMany = useCreatePrintingManyMutation();

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

  const handlePrintAll = () => {
    if (
      !filteredOrders ||
      !filteredOrders.data ||
      filteredOrders.data.length === 0
    ) {
      toast.error("No orders available to print");
      setPrintDialogOpen(false);
      return;
    }

    // Extract order IDs from filtered orders
    const orderIds = filteredOrders.data.map((order) => order.id_pesanan);

    // Call the mutation with the array of order IDs
    createPrintingMany.mutate({ id_pesanan: orderIds });
    setPrintDialogOpen(false);
  };

  // Check if there's data to display
  const hasData = !readyOrdersLoading && filteredOrders?.data?.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <PrintingFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={createPrintingMany.isPending}
          isPrintingReady={true}
        />

        {/* Only render button when there's data */}
        {hasData && (
          <Button
            onClick={() => setPrintDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print All Labels</span>
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <PrintingTableContentReady
          orders={filteredOrders}
          isLoading={readyOrdersLoading}
          caption="Orders that need to be sent."
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <AlertDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Printing All Labels</AlertDialogTitle>
            <AlertDialogDescription>
              This action will create printing labels for{" "}
              {filteredOrders?.data?.length || 0} orders. Are you sure you want
              to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePrintAll}
              disabled={createPrintingMany.isPending}
            >
              {createPrintingMany.isPending ? "Processing..." : "Print All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
