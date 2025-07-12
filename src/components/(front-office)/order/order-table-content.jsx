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
import { EyeIcon } from "lucide-react";
import { usePatchStatusPesananMutation } from "@/api/(front-office)/order/mutation";
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { getStatusBadgeColorClass } from "@/utils/status-formatter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OrderTableContent(props) {
  const patchStatusMutation = usePatchStatusPesananMutation();
  const totalItems = props.orders?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.orders?.data?.slice(startIndex, endIndex) || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  const handleStatusChange = (orderId, newStatus) => {
    patchStatusMutation.mutate({
      idPesanan: orderId,
      status: newStatus,
    });
  };

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
                <TableCell colSpan={7} className="text-center py-4">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((order, index) => (
                <TableRow key={order.id_pesanan}>
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
                <TableCell colSpan={7} className="text-center py-4">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total Orders: {totalItems}</TableCell>
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
