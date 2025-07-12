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
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { useEffect, useState } from "react";

export function PrintingTableContent(props) {
  const totalItems = props.printing?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.printing?.data?.slice(startIndex, endIndex) || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  useEffect(() => {
    if (props.printing?.data) {
      const hasManyItems = props.printing.data.length > 10;
      const hasLongContent = props.printing.data.some(
        (printing) =>
          (printing.id_pencetakan && printing.id_pencetakan.length > 20) ||
          (printing.id_pesanan && printing.id_pesanan.length > 20),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [props.printing]);

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
                Printing ID
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Order ID
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Printing Date
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
                <TableCell colSpan={5} className="text-center py-4">
                  Loading printing records...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((printing, index) => (
                <TableRow key={printing.id_pencetakan}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {printing.id_pencetakan}
                  </TableCell>
                  <TableCell>{printing.id_pesanan}</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(printing.tgl_pencetakan)}
                  </TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    <Link
                      href={`/dashboard/printings/${printing.id_pencetakan}`}
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
                <TableCell colSpan={5} className="text-center py-4">
                  No printing records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Records: {totalItems}</TableCell>
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
