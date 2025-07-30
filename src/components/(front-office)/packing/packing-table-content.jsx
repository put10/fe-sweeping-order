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

export function PackingTableContent(props) {
  const totalItems = props.packing?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.packing?.data?.slice(startIndex, endIndex) || [];
  const allData = props.packing?.data || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [selectionMode, setSelectionMode] = useState("current"); // "current" or "all"

  const handleSelectCurrentPage = () => {
    const currentPageIds = currentData.map((packing) => packing.id_packing);
    props.setSelectedIds((prev) => {
      const uniqueIds = new Set([...prev, ...currentPageIds]);
      return Array.from(uniqueIds);
    });
  };

  const handleSelectAllPages = () => {
    const allIds = allData.map((packing) => packing.id_packing);
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

  const handleSelectPacking = (packingId, checked) => {
    if (checked) {
      props.setSelectedIds((prev) => [...prev, packingId]);
    } else {
      props.setSelectedIds((prev) => prev.filter((id) => id !== packingId));
    }
  };

  const isAllCurrentPageSelected =
    currentData.length > 0 &&
    currentData.every((packing) =>
      props.selectedIds.includes(packing.id_packing),
    );

  const isAllPagesSelected =
    allData.length > 0 &&
    allData.every((packing) => props.selectedIds.includes(packing.id_packing));

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
              <TableHead>Packing ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Packing Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading packing records...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((packing, index) => (
                <TableRow key={packing.id_packing}>
                  <TableCell>
                    <Checkbox
                      checked={props.selectedIds.includes(packing.id_packing)}
                      onCheckedChange={(checked) =>
                        handleSelectPacking(packing.id_packing, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {packing.id_packing}
                  </TableCell>
                  <TableCell>
                    {packing.pencetakan_label?.id_pesanan ||
                      packing.id_pesanan ||
                      "-"}
                  </TableCell>
                  <TableCell>
                    {formatDateToIndonesian(packing.created_at)}
                  </TableCell>
                  <TableCell>
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
                <TableCell colSpan={6} className="text-center py-4">
                  No packing records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total Records: {totalItems}</TableCell>
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
