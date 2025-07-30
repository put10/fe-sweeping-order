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
import { usePatchStatusPesananMutation } from "@/api/(front-office)/order/mutation";
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { getStatusBadgeColorClass } from "@/utils/status-formatter";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function OrderTableContent(props) {
  const patchStatusMutation = usePatchStatusPesananMutation();
  const totalItems = props.orders?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.orders?.data?.slice(startIndex, endIndex) || [];
  const allData = props.orders?.data || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [selectionMode, setSelectionMode] = useState("current"); // "current" or "all"

  const handleStatusChange = (orderId, newStatus) => {
    patchStatusMutation.mutate({
      idPesanan: orderId,
      status: newStatus,
    });
  };

  const handleSelectCurrentPage = () => {
    const currentPageIds = currentData.map((order) => order.id_pesanan);
    props.setSelectedIds((prev) => {
      const uniqueIds = new Set([...prev, ...currentPageIds]);
      return Array.from(uniqueIds);
    });
  };

  const handleSelectAllPages = () => {
    const allIds = allData.map((order) => order.id_pesanan);
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

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      props.setSelectedIds((prev) => [...prev, orderId]);
    } else {
      props.setSelectedIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const isAllCurrentPageSelected =
    currentData.length > 0 &&
    currentData.every((order) => props.selectedIds.includes(order.id_pesanan));

  const isAllPagesSelected =
    allData.length > 0 &&
    allData.every((order) => props.selectedIds.includes(order.id_pesanan));

  const isIndeterminate =
    props.selectedIds.length > 0 &&
    ((selectionMode === "current" && !isAllCurrentPageSelected) ||
      (selectionMode === "all" && !isAllPagesSelected));

  useEffect(() => {
    if (props.orders?.data) {
      const hasManyItems = props.orders.data.length > 10;
      const hasLongContent = props.orders.data.some(
        (order) =>
          (order.id_pesanan && order.id_pesanan.length > 20) ||
          (order.marketplace?.nama_marketplace &&
            order.marketplace.nama_marketplace.length > 20) ||
          (order.jasa_pengiriman?.nama_jasa &&
            order.jasa_pengiriman.nama_jasa.length > 20),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [props.orders]);

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
              <TableHead className={needsHorizontalScroll ? "w-[50px]" : ""}>
                No
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Order ID
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Status
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Marketplace
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Shipping Service
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Created At
              </TableHead>
              <TableHead
                className={`sticky right-0 z-20 bg-white ${
                  needsHorizontalScroll
                    ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)] w-[100px]"
                    : ""
                }`}
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((order, index) => (
                <TableRow key={order.id_pesanan}>
                  <TableCell>
                    <Checkbox
                      checked={props.selectedIds.includes(order.id_pesanan)}
                      onCheckedChange={(checked) =>
                        handleSelectOrder(order.id_pesanan, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {order.id_pesanan}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status_pesanan}
                      onValueChange={(value) =>
                        handleStatusChange(order.id_pesanan, value)
                      }
                      disabled={patchStatusMutation.isPending}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[130px]",
                          getStatusBadgeColorClass(order.status_pesanan),
                        )}
                      >
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {props.statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {order.marketplace?.nama_marketplace || "-"}
                  </TableCell>
                  <TableCell>
                    {order.jasa_pengiriman?.nama_jasa || "-"}
                  </TableCell>
                  <TableCell>
                    {formatDateToIndonesian(order.created_at)}
                  </TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    <Link href={`/dashboard/orders/${order.id_pesanan}`}>
                      <Button variant="ghost" size="sm">
                        <EyeIcon /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total Orders: {totalItems}</TableCell>
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
