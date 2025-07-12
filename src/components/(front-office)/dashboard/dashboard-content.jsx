"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Store,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  useGetAllOrders,
  useGetLastFiveMinutesOrders,
} from "@/api/(front-office)/order/queries";
import { useGetAllProduct } from "@/api/(front-office)/product/queries";
import { useGetAllCustomer } from "@/api/(front-office)/customer/queries";
import { useGetAllMarketplaces } from "@/api/(front-office)/marketplace/queries";
import { useGetAllShippingServices } from "@/api/(front-office)/shipping-service/queries";
import { formatIDR } from "@/utils/currency-formatter";
import {
  PREDEFINED_STATUS_OPTIONS,
  getStatusBadgeColorClass,
} from "@/utils/status-formatter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Cookie from "js-cookie";

export default function DashboardContent() {
  const [username, setUsername] = useState("Admin");
  const [currentTime, setCurrentTime] = useState("");
  const { data: ordersData } = useGetAllOrders();
  const { data: productsData } = useGetAllProduct();
  const { data: customersData } = useGetAllCustomer();
  const { data: recentOrdersData } = useGetLastFiveMinutesOrders();
  const { data: marketplacesData } = useGetAllMarketplaces();
  const { data: shippingServicesData } = useGetAllShippingServices();
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
    // Set the username from cookie after component mounts
    const cookieUsername = Cookie.get("username");
    if (cookieUsername) {
      setUsername(cookieUsername);
    }

    // Set current time
    setCurrentTime(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    // Initialize newStats without depending on previous stats
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

      // Calculate status distribution
      const statusDist = {};
      PREDEFINED_STATUS_OPTIONS.forEach((option) => {
        statusDist[option.value] = ordersData.data.filter(
          (order) =>
            order.status_pesanan.toLowerCase() === option.value.toLowerCase(),
        ).length;
      });

      // Calculate marketplace distribution
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
        {/* Performance and Working Time cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Total processed orders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Three-column layout: Shipping | Analytics | System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column - Shipping List */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrdersData?.data?.slice(0, 5).map((order) => (
                  <div
                    key={order.id_pesanan}
                    className="flex items-center justify-between gap-4 border-b pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Order #{order.id_pesanan.substring(0, 8)} -{" "}
                          {order.pembeli.nama_pembeli}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatIDR(order.total_harga)} •{" "}
                          {order.marketplace.nama_marketplace}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={getStatusBadgeColorClass(order.status_pesanan)}
                    >
                      {order.status_pesanan}
                    </Badge>
                  </div>
                ))}

                {!recentOrdersData?.data?.length && (
                  <p className="text-sm text-muted-foreground">
                    No recent orders found
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
                    Revenue
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag />
                    <span className="text-lg font-bold">
                      {formatIDR(stats.totalRevenue)}
                    </span>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Customers
                  </div>
                  <div className="flex items-center gap-2">
                    <Users />
                    <span className="text-lg font-bold">
                      {stats.totalCustomers}
                    </span>
                  </div>
                </div>

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
          <Card className="md:row-span-2">
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

          {/* Middle column bottom - Sales by Marketplace */}
          <Card className="md:col-start-2 md:col-end-3">
            <CardHeader>
              <CardTitle>Sales by Marketplace</CardTitle>
              <CardDescription>
                Order distribution across marketplaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketplacesData?.data &&
                  marketplacesData.data.slice(0, 3).map((marketplace) => {
                    const count =
                      stats.marketplaceDistribution[
                        marketplace.id_marketplace
                      ] || 0;
                    const percentage =
                      Math.round((count / stats.totalOrders) * 100) || 0;

                    return (
                      <div
                        key={marketplace.id_marketplace}
                        className="space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">
                              {marketplace.nama_marketplace}
                            </p>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}

                {!marketplacesData?.data?.length && (
                  <p className="text-sm text-muted-foreground">
                    No marketplace data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
