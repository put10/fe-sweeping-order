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

export function PackingTableContent(props) {
  const totalItems = props.packing?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.packing?.data?.slice(startIndex, endIndex) || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  useEffect(() => {
    if (props.packing?.data) {
      const hasManyItems = props.packing.data.length > 10;
      const hasLongContent = props.packing.data.some(
        (packing) =>
          (packing.id_packing && packing.id_packing.length > 20) ||
          (packing.id_pencetakan && packing.id_pencetakan.length > 20) ||
          (packing.id_pesanan && packing.id_pesanan.length > 20),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [props.packing]);

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
                Packing ID
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
                  Loading packing records...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((packing, index) => (
                <TableRow key={packing.id_packing}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {packing.id_packing}
                  </TableCell>
                  <TableCell>
                    {packing.pencetakan_label?.id_pesanan ||
                      packing.id_pesanan ||
                      "-"}
                  </TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    <Link href={`/dashboard/packings/${packing.id_packing}`}>
                      <Button variant="ghost" size="sm">
                        <EyeIcon /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No packing records found.
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
