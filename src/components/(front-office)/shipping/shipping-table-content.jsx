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

export function ShippingTableContent(props) {
  const totalItems = props.shipping?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.shipping?.data?.slice(startIndex, endIndex) || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  useEffect(() => {
    if (props.shipping?.data) {
      const hasManyItems = props.shipping.data.length > 10;
      const hasLongContent = props.shipping.data.some(
        (shipping) =>
          (shipping.id_pengiriman && shipping.id_pengiriman.length > 20) ||
          (shipping.id_packing && shipping.id_packing.length > 20),
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
              <TableHead className={needsHorizontalScroll ? "w-[50px]" : ""}>
                No
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Shipping ID
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Order ID
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
                <TableCell colSpan={4} className="text-center py-4">
                  Loading shipping records...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((shipping, index) => (
                <TableRow key={shipping.id_pengiriman}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {shipping.id_pengiriman}
                  </TableCell>
                  <TableCell>
                    {shipping.packing?.pencetakan_label?.id_pesanan || "-"}
                  </TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
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
                <TableCell colSpan={4} className="text-center py-4">
                  No shipping records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Records: {totalItems}</TableCell>
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
