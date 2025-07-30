"use client";

import { Input } from "@/components/ui/input";
import {
  useGetStockByProduct,
  useSearchStockByProduct,
} from "@/api/(front-office)/stock/queries";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { StockTableContent } from "./stock-table-content";
import { StockDialog } from "./stock-dialog";
import Cookies from "js-cookie";

export function StockTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allStocks, isLoading: isLoadingAllStocks } =
    useGetStockByProduct();
  const { data: searchedStocks, isLoading: isLoadingSearch } =
    useSearchStockByProduct(debouncedSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userRole, setUserRole] = useState("");

  // Check if user has admin privileges
  const hasAdminPrivileges = ["ADMIN_IT", "ADMIN"].includes(userRole);

  const products = debouncedSearch ? searchedStocks : allStocks;
  const isLoading = debouncedSearch ? isLoadingSearch : isLoadingAllStocks;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get user role from cookies
  useEffect(() => {
    setUserRole(Cookies.get("role") || "");
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasAdminPrivileges && <StockDialog />}
      </div>
      <div className="rounded-md border">
        <StockTableContent
          products={products}
          isLoading={isLoading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          hasAdminPrivileges={hasAdminPrivileges}
        />
      </div>
    </>
  );
}

export default StockTable;
