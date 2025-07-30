"use client";

import { Input } from "@/components/ui/input";
import {
  useGetStockByHistory,
  useGetFilterStockByHistoryProduct,
} from "@/api/(front-office)/stock/queries";
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
import StockHistoryFilter from "@/components/(front-office)/stock/stock-history-filter";

export default function StockHistoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  // API queries
  const { data: stockHistory, isLoading: isLoadingAll } =
    useGetStockByHistory();
  const { data: filteredStockHistory, isLoading: isLoadingFiltered } =
    useGetFilterStockByHistoryProduct(productFilter);

  // Determine which data source to use
  const dataSource = productFilter ? filteredStockHistory : stockHistory;
  const isLoading = productFilter ? isLoadingFiltered : isLoadingAll;

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter data based on search term
  useEffect(() => {
    if (dataSource?.data) {
      if (debouncedSearch) {
        const lowercaseSearch = debouncedSearch.toLowerCase();
        const filtered = dataSource.data.filter(
          (item) =>
            item.produk?.nama_produk?.toLowerCase().includes(lowercaseSearch) ||
            item.deskripsi?.toLowerCase().includes(lowercaseSearch) ||
            item.tipe_transaksi?.toLowerCase().includes(lowercaseSearch),
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(dataSource.data);
      }
      setCurrentPage(1);
    }
  }, [debouncedSearch, dataSource]);

  // Filter data based on search term
  useEffect(() => {
    if (dataSource?.data) {
      // Ensure data is an array
      const dataArray = Array.isArray(dataSource.data) ? dataSource.data : [];

      if (debouncedSearch) {
        const lowercaseSearch = debouncedSearch.toLowerCase();
        const filtered = dataArray.filter(
          (item) =>
            item.produk?.nama_produk?.toLowerCase().includes(lowercaseSearch) ||
            item.deskripsi?.toLowerCase().includes(lowercaseSearch) ||
            item.tipe_transaksi?.toLowerCase().includes(lowercaseSearch),
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(dataArray);
      }
      setCurrentPage(1);
    }
  }, [debouncedSearch, dataSource]);

  // Handle filter changes
  const handleFilterChange = (productId) => {
    setProductFilter(productId);
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalItems = filteredData?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredData?.slice(startIndex, endIndex) || [];

  // Format transaction type for display
  const formatTransactionType = (type) => {
    switch (type) {
      case "STOK_MASUK_MANUAL":
        return "Stock In (Manual)";
      case "STOK_KELUAR_MANUAL":
        return "Stock Out (Manual)";
      case "STOK_KELUAR_PESANAN":
        return "Stock Out (Order)";
      default:
        return type;
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or description"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <StockHistoryFilter onFilterChange={handleFilterChange} />
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
                  Stock In
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[100px]" : ""}>
                  Stock Out
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[120px]" : ""}>
                  Remaining Stock
                </TableHead>
                <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                  Transaction Type
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
                  <TableCell colSpan={10} className="text-center py-4">
                    Loading stock history...
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
                    <TableCell>{item.stok_masuk || 0}</TableCell>
                    <TableCell>{item.stok_keluar || 0}</TableCell>
                    <TableCell>{item.stok_sisa || 0}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.tipe_transaksi === "STOK_MASUK_MANUAL"
                            ? "bg-green-100 text-green-700"
                            : item.tipe_transaksi === "STOK_KELUAR_MANUAL"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {formatTransactionType(item.tipe_transaksi)}
                      </span>
                    </TableCell>
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
                  <TableCell colSpan={10} className="text-center py-4">
                    {debouncedSearch
                      ? "No stock history found matching your search."
                      : "No stock history found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={9}>
                  Total Transactions: {totalItems}
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
