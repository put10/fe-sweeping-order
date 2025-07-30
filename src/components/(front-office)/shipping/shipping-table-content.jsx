"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EyeIcon, ChevronDown } from "lucide-react";
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function ShippingTableContent(props) {
  const totalItems = props.shipping?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.shipping?.data?.slice(startIndex, endIndex) || [];
  const allData = props.shipping?.data || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [selectionMode, setSelectionMode] = useState("current"); // "current" or "all"

  const handleSelectCurrentPage = () => {
    const currentPageIds = currentData.map(
      (shipping) => shipping.id_pengiriman,
    );
    props.setSelectedIds((prev) => {
      const uniqueIds = new Set([...prev, ...currentPageIds]);
      return Array.from(uniqueIds);
    });
  };

  const handleSelectAllPages = () => {
    const allIds = allData.map((shipping) => shipping.id_pengiriman);
    props.setSelectedIds(allIds);
  };

  const handleClearSelection = () => {
    props.setSelectedIds([]);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      if (selectionMode === "current") {
        handleSelectCurrentPage();
      } else {
        handleSelectAllPages();
      }
    } else {
      handleClearSelection();
    }
  };

  const handleSelectShipping = (shippingId, checked) => {
    if (checked) {
      props.setSelectedIds((prev) => [...prev, shippingId]);
    } else {
      props.setSelectedIds((prev) => prev.filter((id) => id !== shippingId));
    }
  };

  const isAllCurrentPageSelected =
    currentData.length > 0 &&
    currentData.every((shipping) =>
      props.selectedIds.includes(shipping.id_pengiriman),
    );

  const isAllPagesSelected =
    allData.length > 0 &&
    allData.every((shipping) =>
      props.selectedIds.includes(shipping.id_pengiriman),
    );

  useEffect(() => {
    if (props.shipping?.data) {
      const hasManyItems = props.shipping.data.length > 10;
      const hasLongContent = props.shipping.data.some(
        (shipping) =>
          (shipping.id_pengiriman && shipping.id_pengiriman.length > 20) ||
          (shipping.id_packing && shipping.id_packing.length > 20) ||
          (shipping.id_pesanan && shipping.id_pesanan.length > 20) ||
          (shipping.nomor_resi && shipping.nomor_resi.length > 20),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [props.shipping]);

  return (
    <>
      <div className={needsHorizontalScroll ? "relative overflow-x-auto" : ""}>
        <Table className={needsHorizontalScroll ? "min-w-full" : ""}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <Checkbox
                        checked={
                          selectionMode === "current"
                            ? isAllCurrentPageSelected
                            : isAllPagesSelected
                        }
                        onCheckedChange={handleSelectAll}
                      />
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectionMode("current");
                        handleSelectCurrentPage();
                      }}
                    >
                      Select all on current page
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectionMode("all");
                        handleSelectAllPages();
                      }}
                    >
                      Select all across all pages ({totalItems})
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleClearSelection}>
                      Clear selection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead>No</TableHead>
              <TableHead>Shipping ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading shipping data...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((shipping, index) => (
                <TableRow key={shipping.id_pengiriman}>
                  <TableCell>
                    <Checkbox
                      checked={props.selectedIds.includes(
                        shipping.id_pengiriman,
                      )}
                      onCheckedChange={(checked) =>
                        handleSelectShipping(shipping.id_pengiriman, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {shipping.id_pengiriman}
                  </TableCell>
                  <TableCell>
                    {shipping.packing?.pencetakan_label?.id_pesanan || "-"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/shippings/${shipping.id_pengiriman}`}
                    >
                      <Button variant="ghost" size="sm">
                        <EyeIcon /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No shipping data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total Records: {totalItems}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <PaginationLayout
        currentPage={props.currentPage}
        totalPages={totalPages}
        setCurrentPage={props.setCurrentPage}
      />
    </>
  );
}
