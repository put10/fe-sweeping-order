"use client";

import { Input } from "@/components/ui/input";
import { useGetOutStockHistory } from "@/api/(front-office)/stock/queries";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
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
import Link from "next/link";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { StockRemoveDialog } from "@/components/(front-office)/stock/stock-remove-dialog";
import Cookies from "js-cookie";

export default function StockOutHistoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: stockOutHistory, isLoading } = useGetOutStockHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setUserRole] = useState("");

  const hasAdminPrivileges = ["ADMIN_IT", "ADMIN"].includes(userRole);

  // Get user role from cookies
  useEffect(() => {
    setUserRole(Cookies.get("role") || "");
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter data based on search term
  useEffect(() => {
    if (stockOutHistory?.data) {
      if (debouncedSearch) {
        const lowercaseSearch = debouncedSearch.toLowerCase();
        const filtered = stockOutHistory.data.filter(
          (item) =>
            item.produk?.nama_produk?.toLowerCase().includes(lowercaseSearch) ||
            item.deskripsi?.toLowerCase().includes(lowercaseSearch),
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(stockOutHistory.data);
      }
      setCurrentPage(1);
    }
  }, [debouncedSearch, stockOutHistory]);

  // Check if horizontal scroll is needed
  useEffect(() => {
    if (stockOutHistory?.data) {
      const hasManyItems = stockOutHistory.data.length > 10;
      const hasLongContent = stockOutHistory.data.some(
        (item) =>
          (item.id && item.id.length > 20) ||
          (item.deskripsi && item.deskripsi.length > 30),
      );

      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [stockOutHistory]);

  // Pagination calculations
  const totalItems = filteredData?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData?.slice(startIndex, endIndex) || [];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or description"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasAdminPrivileges && <StockRemoveDialog />}
      </div>
      <div className="rounded-md border">
        <div
          className={needsHorizontalScroll ? "relative overflow-x-auto" : ""}
        >
          <Table className={needsHorizontalScroll ? "min-w-full" : ""}>
            <TableHeader>
              <TableRow>
                <TableHead className={needsHorizontalScroll ? "w-[50px]" : ""}>
                  No
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[180px]" : ""}>
                  Transaction ID
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[200px]" : ""}>
                  Product Name
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[100px]" : ""}>
                  Stock Removed
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[120px]" : ""}>
                  Remaining Stock
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[200px]" : ""}>
                  Description
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                  Date
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Loading stock-out history...
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell
                      className={
                        needsHorizontalScroll
                          ? "overflow-hidden text-ellipsis"
                          : ""
                      }
                    >
                      {item.id}
                    </TableCell>
                    <TableCell>{item.produk?.nama_produk || "-"}</TableCell>
                    <TableCell>{item.stok_keluar}</TableCell>
                    <TableCell>{item.stok_sisa}</TableCell>
                    <TableCell>{item.deskripsi}</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(item.created_at)}
                    </TableCell>
                    <TableCell
                      className={`sticky right-0 z-10 bg-white ${
                        needsHorizontalScroll
                          ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                          : ""
                      }`}
                    >
                      <Link href={`/dashboard/stock/${item.id_produk}`}>
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="mr-2 h-4 w-4" /> View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    {debouncedSearch
                      ? "No stock-out history found matching your search."
                      : "No stock-out history found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  Total Stock-Out Transactions: {totalItems}
                </TableCell>
                <TableCell
                  className={`sticky right-0 ${
                    needsHorizontalScroll
                      ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                      : ""
                  }`}
                ></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <PaginationLayout
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}
