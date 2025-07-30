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

export function PrintingTableContent(props) {
  const totalItems = props.printing?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.printing?.data?.slice(startIndex, endIndex) || [];
  const allData = props.printing?.data || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [selectionMode, setSelectionMode] = useState("current"); // "current" or "all"

  const handleSelectCurrentPage = () => {
    const currentPageIds = currentData.map(
      (printing) => printing.id_pencetakan,
    );
    props.setSelectedIds((prev) => {
      const uniqueIds = new Set([...prev, ...currentPageIds]);
      return Array.from(uniqueIds);
    });
  };

  const handleSelectAllPages = () => {
    const allIds = allData.map((printing) => printing.id_pencetakan);
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

  const handleSelectPrinting = (printingId, checked) => {
    if (checked) {
      props.setSelectedIds((prev) => [...prev, printingId]);
    } else {
      props.setSelectedIds((prev) => prev.filter((id) => id !== printingId));
    }
  };

  const isAllCurrentPageSelected =
    currentData.length > 0 &&
    currentData.every((printing) =>
      props.selectedIds.includes(printing.id_pencetakan),
    );

  const isAllPagesSelected =
    allData.length > 0 &&
    allData.every((printing) =>
      props.selectedIds.includes(printing.id_pencetakan),
    );

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
              <TableHead>Printing ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Printing Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading printing data...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((printing, index) => (
                <TableRow key={printing.id_pencetakan}>
                  <TableCell>
                    <Checkbox
                      checked={props.selectedIds.includes(
                        printing.id_pencetakan,
                      )}
                      onCheckedChange={(checked) =>
                        handleSelectPrinting(printing.id_pencetakan, checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {printing.id_pencetakan}
                  </TableCell>
                  <TableCell>{printing.id_pesanan}</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(printing.created_at)}
                  </TableCell>
                  <TableCell>
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
                <TableCell colSpan={7} className="text-center py-4">
                  No printing data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                Total Printing Items: {totalItems}
              </TableCell>
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
