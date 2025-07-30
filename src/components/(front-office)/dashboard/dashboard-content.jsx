"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Package, Truck, Store, AlertCircle } from "lucide-react";
import {
  useGetAllOrders,
  useGetLastFiveMinutesOrders,
} from "@/api/(front-office)/order/queries";
import { useGetAllProduct } from "@/api/(front-office)/product/queries";
import { useGetAllCustomer } from "@/api/(front-office)/customer/queries";
import { useGetAllMarketplaces } from "@/api/(front-office)/marketplace/queries";
import { useGetAllShippingServices } from "@/api/(front-office)/shipping-service/queries";
import { formatIDR } from "@/utils/currency-formatter";
import { PREDEFINED_STATUS_OPTIONS } from "@/utils/status-formatter";
import { Badge } from "@/components/ui/badge";
import Cookie from "js-cookie";
import ProductCharts from "@/components/(front-office)/dashboard/product-charts";
import { useGetExpiringSoonCooperations } from "@/api/(front-office)/cooperation/queries";
import { useNewestStock } from "@/api/(front-office)/stock/queries";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";

function NewestStockTable() {
  const { data: newestStockData, isLoading } = useNewestStock();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  const totalItems = newestStockData?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = newestStockData?.data?.slice(startIndex, endIndex) || [];

  useEffect(() => {
    if (newestStockData?.data) {
      const hasManyItems = newestStockData.data.length > 10;
      const hasLongContent = newestStockData.data.some(
        (item) =>
          (item.produk.nama_produk && item.produk.nama_produk.length > 25) ||
          (item.produk.brand?.nama_brand &&
            item.produk.brand.nama_brand.length > 15) ||
          (item.produk.gudang?.nama_gudang &&
            item.produk.gudang.nama_gudang.length > 15),
      );
      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [newestStockData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Newest Stock per Product
        </CardTitle>
        <CardDescription>
          Latest stock update for each product in the warehouse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={needsHorizontalScroll ? "relative overflow-x-auto" : ""}
        >
          <Table className={needsHorizontalScroll ? "min-w-[700px]" : ""}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">No</TableHead>
                <TableHead className="w-[160px]">Product Name</TableHead>
                <TableHead className="w-[100px]">Brand</TableHead>
                <TableHead className="w-[110px]">Warehouse</TableHead>
                <TableHead className="w-[90px]">Category</TableHead>
                <TableHead className="w-[90px]">Price</TableHead>
                <TableHead className="w-[70px]">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading stock data...
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((item, idx) => (
                  <TableRow key={item.produk.id_produk}>
                    <TableCell>{startIndex + idx + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item.produk.nama_produk}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.produk.brand?.nama_brand || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.produk.gudang?.nama_gudang || "-"}
                    </TableCell>
                    <TableCell>{item.produk.kategori}</TableCell>
                    <TableCell>{formatIDR(item.produk.harga)}</TableCell>
                    <TableCell className="font-bold">
                      {item.produk.stok}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No stock data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total Products: {totalItems}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <PaginationLayout
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}

export default function DashboardContent() {
  const [username, setUsername] = useState("Admin");
  const [currentTime, setCurrentTime] = useState("");
  const { data: ordersData } = useGetAllOrders();
  const { data: productsData } = useGetAllProduct();
  const { data: customersData } = useGetAllCustomer();
  const { data: recentOrdersData } = useGetLastFiveMinutesOrders();
  const { data: marketplacesData } = useGetAllMarketplaces();
  const { data: shippingServicesData } = useGetAllShippingServices();
  const { data: expiringCooperationsData } = useGetExpiringSoonCooperations(1);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalMarketplaces: 0,
    totalShippingServices: 0,
    averageOrderValue: 0,
    statusDistribution: {},
    marketplaceDistribution: {},
    lowStockProducts: 0,
  });

  useEffect(() => {
    const cookieUsername = Cookie.get("username");
    if (cookieUsername) {
      setUsername(cookieUsername);
    }
    setCurrentTime(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    const newStats = {
      totalRevenue: 0,
      totalCustomers: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalMarketplaces: 0,
      totalShippingServices: 0,
      averageOrderValue: 0,
      statusDistribution: {},
      marketplaceDistribution: {},
      lowStockProducts: 0,
    };

    if (ordersData?.data) {
      const revenue = ordersData.data.reduce(
        (sum, order) => sum + parseFloat(order.total_harga),
        0,
      );
      const statusDist = {};
      PREDEFINED_STATUS_OPTIONS.forEach((option) => {
        statusDist[option.value] = ordersData.data.filter(
          (order) =>
            order.status_pesanan.toLowerCase() === option.value.toLowerCase(),
        ).length;
      });
      const marketplaceDist = {};
      ordersData.data.forEach((order) => {
        const marketplaceId = order.marketplace.id_marketplace;
        marketplaceDist[marketplaceId] =
          (marketplaceDist[marketplaceId] || 0) + 1;
      });

      newStats.totalRevenue = revenue;
      newStats.totalOrders = ordersData.data.length;
      newStats.averageOrderValue = revenue / ordersData.data.length || 0;
      newStats.statusDistribution = statusDist;
      newStats.marketplaceDistribution = marketplaceDist;
    }

    if (customersData?.data) {
      newStats.totalCustomers = customersData.data.length;
    }

    if (productsData?.data) {
      newStats.totalProducts = productsData.data.length;
      newStats.lowStockProducts = productsData.data.filter(
        (product) => product.stok < 10,
      ).length;
    }

    if (marketplacesData?.data) {
      newStats.totalMarketplaces = marketplacesData.data.length;
    }

    if (shippingServicesData?.data) {
      newStats.totalShippingServices = shippingServicesData.data.length;
    }

    setStats(newStats);
  }, [
    ordersData,
    customersData,
    productsData,
    marketplacesData,
    shippingServicesData,
  ]);

  function formatRole(role) {
    if (role === "CEO") {
      return "CEO";
    }
    if (role === "ADMIN_IT") {
      return "Admin IT";
    }
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Welcome to the dashboard</CardDescription>
        <CardTitle className="text-2xl font-bold">
          Have a great day, {formatRole(username)}!
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {currentTime ? `Last updated: ${currentTime}` : "Loading..."}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatIDR(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Product charts */}
        <ProductCharts />

        {/* Newest Stock Table */}
        <NewestStockTable />

        {/* Two-column layout: Shipping | System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column - Expiring Cooperations */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Expiring Cooperations
              </CardTitle>
              <CardDescription>
                List of brands with cooperation ending within the next 1 month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringCooperationsData?.data?.length > 0 ? (
                  expiringCooperationsData.data.map((item) => (
                    <div
                      key={item.id_kerjasama}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.brand.nama_brand} ({item.nama_client})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ending on{" "}
                          {new Date(
                            item.tgl_akhir_kerjasama,
                          ).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          • {item.sisa_hari} days left
                        </p>
                      </div>
                      <Badge
                        className={
                          "bg-red-100 text-red-800 font-bold border border-red-200"
                        }
                      >
                        Expiring Soon
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No cooperations expiring soon.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Middle column top - Analytic View */}
          <Card>
            <CardHeader>
              <CardTitle>Analytic View</CardTitle>
              <CardDescription>Sales overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Orders
                  </div>
                  <div className="flex items-center gap-2">
                    <Package />
                    <span className="text-lg font-bold">
                      {stats.totalOrders}
                    </span>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Products
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck />
                    <span className="text-lg font-bold">
                      {stats.totalProducts}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right column - System Analytic */}
          <Card>
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
              <CardDescription>
                Overview of your back-office system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Marketplaces
                    </div>
                    <div className="flex items-center gap-2">
                      <Store />
                      <span className="text-lg font-bold">
                        {stats.totalMarketplaces}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Shipping Services
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck />
                      <span className="text-lg font-bold">
                        {stats.totalShippingServices}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Delivery Rate
                    </div>
                    <div className="flex items-center gap-2">
                      <Package />
                      <span className="text-lg font-bold">
                        {stats.statusDistribution["sedang_dikirim"]
                          ? Math.round(
                              (stats.statusDistribution["sedang_dikirim"] /
                                stats.totalOrders) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Cancellation Rate
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle />
                      <span className="text-lg font-bold">
                        {stats.statusDistribution["dibatalkan"]
                          ? Math.round(
                              (stats.statusDistribution["dibatalkan"] /
                                stats.totalOrders) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
