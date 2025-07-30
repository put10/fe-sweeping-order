"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAllOrders,
  useGetLastFiveMinutesOrders,
  useGetSearchOrders,
  useFilterOrders,
} from "@/api/(front-office)/order/queries";
import {
  useExportFilteredOrdersMutation,
  useGenerateOrdersMutation,
  useDownloadTemplateImportMutation,
  useExportSelectedOrdersMutation,
} from "@/api/(front-office)/order/mutation";
import { useExportOrdersMutation } from "@/api/(front-office)/order/mutation";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, FileDown } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { OrderFilter } from "./order-filter";
import {
  PREDEFINED_STATUS_OPTIONS,
  getAllStatusOptions,
} from "@/utils/status-formatter";
import { OrderTableContent } from "./order-table-content";
import { OrderImportDialogForm } from "./order-import-dialog-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function OrderTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({});
  const [activeTab, setActiveTab] = useState("all-orders");
  const [selectedIds, setSelectedIds] = useState([]);
  const prevOrdersRef = useRef(null);

  const { data: allOrders, isLoading: allOrdersLoading } = useGetAllOrders();
  const { data: searchedOrders } = useGetSearchOrders(debouncedSearch);
  const { data: filteredOrders, isLoading: filteredOrdersLoading } =
    useFilterOrders(filterParams);
  const { data: recentOrders, isLoading: recentOrdersLoading } =
    useGetLastFiveMinutesOrders();

  const generateOrders = useGenerateOrdersMutation();
  const exportOrders = useExportOrdersMutation();
  const exportFilteredOrders = useExportFilteredOrdersMutation();
  const downloadTemplateImport = useDownloadTemplateImportMutation();
  const exportSelectedOrders = useExportSelectedOrdersMutation();

  const [allOrdersPage, setAllOrdersPage] = useState(1);
  const [recentOrdersPage, setRecentOrdersPage] = useState(1);
  const itemsPerPage = 10;

  // Load selectedIds from localStorage
  useEffect(() => {
    const storedIds = localStorage.getItem("selectedOrderIds");
    if (storedIds) {
      setSelectedIds(JSON.parse(storedIds));
    }
  }, []);

  // Save selectedIds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedOrderIds", JSON.stringify(selectedIds));
  }, [selectedIds]);

  const hasActiveFilters = !!(
    filterParams.id_brand ||
    filterParams.id_marketplace ||
    filterParams.id_jasa_pengiriman ||
    filterParams.status_pesanan ||
    filterParams.start_date ||
    filterParams.end_date
  );

  const brandOptions = useMemo(() => {
    if (!allOrders?.data) return [];

    const uniqueBrands = new Map();
    allOrders.data.forEach((order) => {
      if (order.pesanan_items?.length > 0) {
        order.pesanan_items.forEach((item) => {
          if (item.produk?.brand) {
            uniqueBrands.set(item.produk.brand.id_brand, {
              value: item.produk.brand.id_brand,
              label: item.produk.brand.nama_brand,
            });
          }
        });
      }
    });

    return Array.from(uniqueBrands.values());
  }, [allOrders]);

  const marketplaceOptions = useMemo(() => {
    if (!allOrders?.data) return [];

    const uniqueMarketplaces = new Map();
    allOrders.data.forEach((order) => {
      if (order.marketplace) {
        uniqueMarketplaces.set(order.marketplace.id_marketplace, {
          value: order.marketplace.id_marketplace,
          label: order.marketplace.nama_marketplace,
        });
      }
    });

    return Array.from(uniqueMarketplaces.values());
  }, [allOrders]);

  const shippingOptions = useMemo(() => {
    if (!allOrders?.data) return [];

    const uniqueShipping = new Map();
    allOrders.data.forEach((order) => {
      if (order.jasa_pengiriman) {
        uniqueShipping.set(order.jasa_pengiriman.id_jasa, {
          value: order.jasa_pengiriman.id_jasa,
          label: order.jasa_pengiriman.nama_jasa,
        });
      }
    });

    return Array.from(uniqueShipping.values());
  }, [allOrders]);

  const statusOptions = useMemo(() => {
    if (!allOrders?.data) return PREDEFINED_STATUS_OPTIONS;
    const statusesFromData = allOrders.data.map(
      (order) => order.status_pesanan,
    );
    return getAllStatusOptions(statusesFromData);
  }, [allOrders]);

  const orders = useMemo(() => {
    if (hasActiveFilters) return filteredOrders;
    if (debouncedSearch) return searchedOrders;
    return allOrders;
  }, [
    hasActiveFilters,
    filteredOrders,
    debouncedSearch,
    searchedOrders,
    allOrders,
  ]);

  const getActiveOrders = () => {
    return activeTab === "all-orders" ? orders : recentOrders;
  };

  // Clear selections when orders data changes
  useEffect(() => {
    const activeOrders = getActiveOrders();
    if (
      prevOrdersRef.current &&
      prevOrdersRef.current !== activeOrders &&
      activeOrders?.data !== prevOrdersRef.current?.data
    ) {
      setSelectedIds([]);
    }
    prevOrdersRef.current = activeOrders;
  }, [allOrders, filteredOrders, searchedOrders, recentOrders, activeTab]);

  const handleExportSelected = () => {
    if (selectedIds.length > 0) {
      exportSelectedOrders.mutate(selectedIds);
    }
  };

  useEffect(() => {
    setAllOrdersPage(1);
  }, [debouncedSearch, filterParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleGenerateOrders = () => {
    generateOrders.mutate({});
  };

  const handleExportLastFiveMinutesOrders = () => {
    exportOrders.mutate();
  };

  // const handleDownloadTemplate = () => {
  //   downloadTemplateImport.mutate();
  // };

  const handleFilterChange = (params) => {
    setFilterParams(params);
    setSearchTerm("");
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    setFilterParams({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <OrderFilter
          brandOptions={brandOptions}
          marketplaceOptions={marketplaceOptions}
          shippingOptions={shippingOptions}
          statusOptions={statusOptions}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={generateOrders.isPending || exportOrders.isPending}
        />
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <OrderImportDialogForm
            disabled={generateOrders.isPending || exportOrders.isPending}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-xs sm:text-sm"
                size="sm"
                disabled={
                  generateOrders.isPending ||
                  exportOrders.isPending ||
                  downloadTemplateImport.isPending
                }
              >
                <Download />
                <span className="hidden sm:inline">Actions</span>
                <span className="sm:hidden">Actions</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/*<DropdownMenuItem*/}
              {/*  onClick={handleDownloadTemplate}*/}
              {/*  disabled={downloadTemplateImport.isPending}*/}
              {/*>*/}
              {/*  <FileDown className="mr-2 h-4 w-4" />*/}
              {/*  {downloadTemplateImport.isPending*/}
              {/*    ? "Downloading..."*/}
              {/*    : "Download Template"}*/}
              {/*</DropdownMenuItem>*/}

              <DropdownMenuItem
                onClick={handleGenerateOrders}
                disabled={generateOrders.isPending}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {generateOrders.isPending ? "Generating..." : "Generate Orders"}
              </DropdownMenuItem>

              {selectedIds.length > 0 && (
                <DropdownMenuItem
                  onClick={handleExportSelected}
                  disabled={exportSelectedOrders.isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exportSelectedOrders.isPending
                    ? "Exporting..."
                    : `Export Selected (${selectedIds.length})`}
                </DropdownMenuItem>
              )}

              {/*{activeTab === "recent-orders" && (*/}
              {/*  <DropdownMenuItem*/}
              {/*    onClick={handleExportLastFiveMinutesOrders}*/}
              {/*    disabled={exportOrders.isPending}*/}
              {/*  >*/}
              {/*    <Download className="mr-2 h-4 w-4" />*/}
              {/*    {exportOrders.isPending*/}
              {/*      ? "Exporting..."*/}
              {/*      : "Export Last 5 Minutes"}*/}
              {/*  </DropdownMenuItem>*/}
              {/*)}*/}

              {hasActiveFilters && (
                <DropdownMenuItem
                  onClick={() => exportFilteredOrders.mutate(filterParams)}
                  disabled={exportFilteredOrders.isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exportFilteredOrders.isPending
                    ? "Exporting..."
                    : "Export Filtered"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Tabs
          defaultValue="all-orders"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-orders">All Orders</TabsTrigger>
            <TabsTrigger value="recent-orders">Last 5 Minutes</TabsTrigger>
          </TabsList>
          <TabsContent value="all-orders">
            <OrderTableContent
              orders={orders}
              isLoading={
                hasActiveFilters ? filteredOrdersLoading : allOrdersLoading
              }
              caption="A list of all orders."
              currentPage={allOrdersPage}
              setCurrentPage={setAllOrdersPage}
              itemsPerPage={itemsPerPage}
              statusOptions={statusOptions}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          </TabsContent>
          <TabsContent value="recent-orders">
            <OrderTableContent
              orders={recentOrders}
              isLoading={recentOrdersLoading}
              caption="Orders from the last 5 minutes."
              currentPage={recentOrdersPage}
              setCurrentPage={setRecentOrdersPage}
              itemsPerPage={itemsPerPage}
              statusOptions={statusOptions}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
