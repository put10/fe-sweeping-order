"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExportFilteredSweepingOrdersMutation } from "@/api/(front-office)/sweeping-order/mutation";

export function SweepingExportFilter({ filterParams, hasActiveFilters }) {
  const exportFilteredSweepingOrders =
    useExportFilteredSweepingOrdersMutation();

  return (
    <>
      {hasActiveFilters && (
        <Button
          onClick={() => exportFilteredSweepingOrders.mutate(filterParams)}
          disabled={exportFilteredSweepingOrders.isPending}
          variant="outline"
          className="flex items-center gap-2 text-xs sm:text-sm"
          size="sm"
          title="Export Filtered Sweeping Orders"
        >
          <Download />
          <span className="hidden sm:inline">
            {exportFilteredSweepingOrders.isPending
              ? "Exporting..."
              : "Export Filtered"}
          </span>
          <span className="sm:hidden">Export</span>
        </Button>
      )}
    </>
  );
}
