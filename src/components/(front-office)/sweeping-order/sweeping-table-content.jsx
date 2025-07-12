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
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";
import { useEffect, useState } from "react";

export function SweepingTableContent(props) {
  const totalItems = props.sweepingOrder?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData =
    props.sweepingOrder?.data?.slice(startIndex, endIndex) || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  useEffect(() => {
    if (props.sweepingOrder?.data) {
      const hasManyItems = props.sweepingOrder.data.length > 10;
      const hasLongContent = props.sweepingOrder.data.some(
        (sweeping) =>
          (sweeping.id_proses && sweeping.id_proses.length > 20) ||
          (sweeping.id_pesanan && sweeping.id_pesanan.length > 20),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [props.sweepingOrder]);

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
                Client
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Brand
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Marketplace
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Order ID
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Order Status
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Process ID
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[120px]" : ""}>
                Process Status
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
                  Loading sweeping records...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((sweeping, index) => (
                <TableRow key={sweeping.id_proses}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>
                    {sweeping.pesanan?.pembeli?.nama_pembeli || "-"}
                  </TableCell>
                  <TableCell>
                    {sweeping.pesanan?.pesanan_items?.length
                      ? [
                          ...new Set(
                            sweeping.pesanan.pesanan_items
                              .map((item) => item.produk?.brand?.nama_brand)
                              .filter(Boolean),
                          ),
                        ].join(", ") || "-"
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {sweeping.pesanan?.marketplace?.nama_marketplace || "-"}
                  </TableCell>
                  <TableCell>{sweeping.id_pesanan}</TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {sweeping.pesanan?.status_pesanan
                        ? sweeping.pesanan.status_pesanan.replace(/_/g, " ")
                        : "-"}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {sweeping.id_proses}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`capitalize ${
                        sweeping.status_proses === "completed"
                          ? "text-green-600"
                          : sweeping.status_proses === "processed"
                            ? "text-blue-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {sweeping.status_proses
                        ? sweeping.status_proses.replace(/_/g, "-")
                        : "-"}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    <Link
                      href={`/dashboard/sweeping-orders/${sweeping.id_proses}`}
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
                <TableCell colSpan={9} className="text-center py-4">
                  No sweeping records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total Records: {totalItems}</TableCell>
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
