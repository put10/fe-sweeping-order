import {
  LayoutDashboard,
  Package,
  Printer,
  Truck,
  Search,
  Store,
  ShoppingBag,
  Box,
  ShoppingCart,
  ChevronDown,
  Handshake,
  Menu,
  Users,
  Users2,
  TruckIcon,
  Archive,
  Warehouse,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { UserMenu } from "@/components/(front-office)/header/user-menu";

export default async function HeaderLayout() {
  const headersList = await headers();
  const pathname = headersList.get("x-current-path") || "/dashboard";
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value || "";

  // Role-based access control functions
  const canAccessCooperations = () => {
    return ["CEO", "ADMIN"].includes(role);
  };

  const canAccessBrands = () => {
    return ["ADMIN_IT", "ADMIN"].includes(role);
  };

  const canAccessProducts = () => {
    return ["ADMIN_IT", "ADMIN"].includes(role);
  };

  const canAccessMarketplaces = () => {
    return ["ADMIN_IT", "ADMIN"].includes(role);
  };

  const canAccessOrders = () => {
    return ["ORDER_STAFF", "ADMIN"].includes(role);
  };

  const canAccessOrderHistory = () => {
    return ["CEO"].includes(role);
  };

  const canAccessSweepingOrders = () => {
    return [
      "ORDER_STAFF",
      "MANAGER",
      "WAREHOUSE_STAFF",
      "SHIPPING_STAFF",
      "ADMIN",
    ].includes(role);
  };

  const canAccessPrintings = () => {
    return ["WAREHOUSE_STAFF", "MANAGER", "ADMIN"].includes(role);
  };

  const canAccessPackings = () => {
    return ["WAREHOUSE_STAFF", "SHIPPING_STAFF", "MANAGER", "ADMIN"].includes(
      role,
    );
  };

  const canAccessShippings = () => {
    return ["SHIPPING_STAFF", "MANAGER", "ADMIN"].includes(role);
  };

  const canAccessUsers = () => {
    return ["ADMIN_IT", "ADMIN"].includes(role);
  };

  // New access control functions
  const canAccessShippingServices = () => {
    return ["ADMIN_IT", "ADMIN"].includes(role);
  };

  const canAccessCustomers = () => {
    return ["ORDER_STAFF", "ADMIN"].includes(role);
  };

  // Stock management access control
  const canAccessStock = () => {
    return ["ADMIN_IT", "ADMIN"].includes(role);
  };

  // Warehouse access control
  const canAccessWarehouse = () => {
    return ["ADMIN_IT", "ADMIN"].includes(role);
  };

  // Check if any operations are accessible
  const canAccessOperations = () => {
    return (
      canAccessSweepingOrders() ||
      canAccessPrintings() ||
      canAccessPackings() ||
      canAccessShippings()
    );
  };

  // Check if any catalogs are accessible
  const canAccessCatalogs = () => {
    return canAccessBrands() || canAccessProducts();
  };

  const getActiveTab = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname.includes("/dashboard/cooperations")) return "cooperations";
    if (
      pathname.includes("/dashboard/packings") ||
      pathname.includes("/dashboard/printings") ||
      pathname.includes("/dashboard/shippings") ||
      pathname.includes("/dashboard/sweeping-orders")
    )
      return "operations";
    if (pathname.includes("/dashboard/shipping-services"))
      return "shipping-services";
    if (pathname.includes("/dashboard/warehouse")) return "warehouse";
    if (pathname.includes("/dashboard/stock")) return "stock";
    if (
      pathname.includes("/dashboard/brands") ||
      pathname.includes("/dashboard/products")
    )
      return "catalogs";
    if (pathname.includes("/dashboard/orders")) return "orders";
    if (pathname.includes("/dashboard/order-history")) return "order-history";
    if (pathname.includes("/dashboard/marketplaces")) return "marketplaces";
    if (pathname.includes("/dashboard/users")) return "users";
    if (pathname.includes("/dashboard/customers")) return "customers";
    return "dashboard";
  };

  return (
    <header className="flex shrink-0 items-center gap-2 px-4">
      <div className="flex items-center justify-between w-full">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 w-full"
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>

              {canAccessCooperations() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/cooperations"
                    className="flex items-center gap-2 w-full"
                  >
                    <Handshake />
                    <span>Cooperations</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessOrderHistory() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/order-history"
                    className="flex items-center gap-2 w-full"
                  >
                    <History />
                    <span>Order History</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessSweepingOrders() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/sweeping-orders"
                    className="flex items-center gap-2 w-full"
                  >
                    <Search />
                    <span>Sweeping Orders</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessPrintings() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/printings"
                    className="flex items-center gap-2 w-full"
                  >
                    <Printer />
                    <span>Printings</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessPackings() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/packings"
                    className="flex items-center gap-2 w-full"
                  >
                    <Package />
                    <span>Packings</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessShippings() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/shippings"
                    className="flex items-center gap-2 w-full"
                  >
                    <Truck />
                    <span>Shipping</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessWarehouse() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/warehouse"
                    className="flex items-center gap-2 w-full"
                  >
                    <Warehouse />
                    <span>Warehouse</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessShippingServices() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/shipping-services"
                    className="flex items-center gap-2 w-full"
                  >
                    <TruckIcon />
                    <span>Shipping Services</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessStock() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/stock"
                    className="flex items-center gap-2 w-full"
                  >
                    <Archive />
                    <span>Stocks</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessBrands() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/brands"
                    className="flex items-center gap-2 w-full"
                  >
                    <Store />
                    <span>Brands</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessProducts() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/products"
                    className="flex items-center gap-2 w-full"
                  >
                    <Box />
                    <span>Products</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessOrders() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center gap-2 w-full"
                  >
                    <ShoppingCart />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessMarketplaces() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/marketplaces"
                    className="flex items-center gap-2 w-full"
                  >
                    <ShoppingBag />
                    <span>Marketplaces</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessUsers() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/users"
                    className="flex items-center gap-2 w-full"
                  >
                    <Users />
                    <span>Users</span>
                  </Link>
                </DropdownMenuItem>
              )}

              {canAccessCustomers() && (
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/customers"
                    className="flex items-center gap-2 w-full"
                  >
                    <Users2 />
                    <span>Customers</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>{" "}
          </DropdownMenu>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0 mr-2">
          <Image src={"/logo.png"} alt="Logo" width={36} height={36} />
          <h1 className="text-xl font-bold">Flexo</h1>
        </div>

        {/* Primary Navigation - Modified to be scrollable */}
        <div className="hidden lg:block flex-1 overflow-hidden mx-2">
          <div className="overflow-x-auto scrollbar-hide">
            <Tabs value={getActiveTab()} defaultValue="dashboard">
              <TabsList
                className={
                  role === "ADMIN"
                    ? "flex w-max space-x-1"
                    : "flex w-full justify-between"
                }
              >
                <TabsTrigger
                  value="dashboard"
                  asChild
                  className="px-2 py-1.5 text-sm"
                >
                  <Link href="/dashboard" className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </TabsTrigger>

                {canAccessCooperations() && (
                  <TabsTrigger
                    value="cooperations"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/cooperations"
                      className="flex items-center gap-1"
                    >
                      <Handshake className="h-4 w-4" />
                      <span>Cooperations</span>
                    </Link>
                  </TabsTrigger>
                )}

                {canAccessOrderHistory() && (
                  <TabsTrigger
                    value="order-history"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/order-history"
                      className="flex items-center gap-1"
                    >
                      <History className="h-4 w-4" />
                      <span>Order History</span>
                    </Link>
                  </TabsTrigger>
                )}

                {canAccessOperations() && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={
                          pathname.includes("/dashboard/packings") ||
                          pathname.includes("/dashboard/printings") ||
                          pathname.includes("/dashboard/shippings") ||
                          pathname.includes("/dashboard/sweeping-orders")
                            ? "outline"
                            : "ghost"
                        }
                        className="flex items-center gap-1 h-8 px-2 text-sm"
                      >
                        <Package className="h-4 w-4" />
                        <span>Operations</span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {canAccessSweepingOrders() && (
                        <DropdownMenuItem>
                          <Link
                            href="/dashboard/sweeping-orders"
                            className="flex items-center gap-2 w-full"
                          >
                            <Search className="h-4 w-4" />
                            <span>Sweeping Orders</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {canAccessPrintings() && (
                        <DropdownMenuItem>
                          <Link
                            href="/dashboard/printings"
                            className="flex items-center gap-2 w-full"
                          >
                            <Printer className="h-4 w-4" />
                            <span>Printings</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {canAccessPackings() && (
                        <DropdownMenuItem>
                          <Link
                            href="/dashboard/packings"
                            className="flex items-center gap-2 w-full"
                          >
                            <Package className="h-4 w-4" />
                            <span>Packings</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {canAccessShippings() && (
                        <DropdownMenuItem>
                          <Link
                            href="/dashboard/shippings"
                            className="flex items-center gap-2 w-full"
                          >
                            <Truck className="h-4 w-4" />
                            <span>Shippings</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {canAccessWarehouse() && (
                  <TabsTrigger
                    value="warehouse"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/warehouse"
                      className="flex items-center gap-1"
                    >
                      <Warehouse className="h-4 w-4" />
                      <span>Warehouse</span>
                    </Link>
                  </TabsTrigger>
                )}

                {canAccessShippingServices() && (
                  <TabsTrigger
                    value="shipping-services"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/shipping-services"
                      className="flex items-center gap-1"
                    >
                      <TruckIcon className="h-4 w-4" />
                      <span>Shipping Services</span>
                    </Link>
                  </TabsTrigger>
                )}

                {canAccessStock() && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={
                          pathname.includes("/dashboard/stock")
                            ? "outline"
                            : "ghost"
                        }
                        className="flex items-center gap-1 h-8 px-2 text-sm"
                      >
                        <Archive className="h-4 w-4" />
                        <span>Stock</span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link
                          href="/dashboard/stock"
                          className="flex items-center gap-2 w-full"
                        >
                          <Archive className="h-4 w-4" />
                          <span>Manage Stock</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href="/dashboard/history-stock"
                          className="flex items-center gap-2 w-full"
                        >
                          <Box className="h-4 w-4" />
                          <span>History Stock</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {canAccessCatalogs() && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={
                          pathname.includes("/dashboard/brands") ||
                          pathname.includes("/dashboard/products")
                            ? "outline"
                            : "ghost"
                        }
                        className="flex items-center gap-1 h-8 px-2 text-sm"
                      >
                        <Box className="h-4 w-4" />
                        <span>Catalogs</span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {canAccessBrands() && (
                        <DropdownMenuItem>
                          <Link
                            href="/dashboard/brands"
                            className="flex items-center gap-2 w-full"
                          >
                            <Store className="h-4 w-4" />
                            <span>Brands</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {canAccessProducts() && (
                        <DropdownMenuItem>
                          <Link
                            href="/dashboard/products"
                            className="flex items-center gap-2 w-full"
                          >
                            <Box className="h-4 w-4" />
                            <span>Products</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {canAccessOrders() && (
                  <TabsTrigger
                    value="orders"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center gap-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </TabsTrigger>
                )}

                {canAccessMarketplaces() && (
                  <TabsTrigger
                    value="marketplaces"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/marketplaces"
                      className="flex items-center gap-1"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Marketplaces</span>
                    </Link>
                  </TabsTrigger>
                )}

                {canAccessUsers() && (
                  <TabsTrigger
                    value="users"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/users"
                      className="flex items-center gap-1"
                    >
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </Link>
                  </TabsTrigger>
                )}

                {canAccessCustomers() && (
                  <TabsTrigger
                    value="customers"
                    asChild
                    className="px-2 py-1.5 text-sm"
                  >
                    <Link
                      href="/dashboard/customers"
                      className="flex items-center gap-1"
                    >
                      <Users2 className="h-4 w-4" />
                      <span>Customers</span>
                    </Link>
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* User Menu */}
        <div className="shrink-0 ml-2">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
