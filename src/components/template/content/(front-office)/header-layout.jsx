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

  // Check if any operations are accessible
  const canAccessOperations = () => {
    return (
      canAccessSweepingOrders() ||
      canAccessPrintings() ||
      canAccessPackings() ||
      canAccessShippings()
      // Removed canAccessShippingServices()
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
      // Removed shipping-services from here
    )
      return "operations";
    if (pathname.includes("/dashboard/shipping-services"))
      return "shipping-services";
    if (
      pathname.includes("/dashboard/brands") ||
      pathname.includes("/dashboard/products")
    )
      return "catalogs";
    if (pathname.includes("/dashboard/orders")) return "orders";
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">Flexo</h1>
        </div>

        {/* Primary Navigation */}
        <div className="hidden lg:flex">
          <Tabs value={getActiveTab()} defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </TabsTrigger>

              {canAccessCooperations() && (
                <TabsTrigger value="cooperations" asChild>
                  <Link
                    href="/dashboard/cooperations"
                    className="flex items-center gap-2"
                  >
                    <Handshake />
                    <span>Cooperations</span>
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
                      className="flex items-center gap-2"
                    >
                      <Package />
                      <span>Operations</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
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
                          <span>Shippings</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {canAccessShippingServices() && (
                <TabsTrigger value="shipping-services" asChild>
                  <Link
                    href="/dashboard/shipping-services"
                    className="flex items-center gap-2"
                  >
                    <TruckIcon />
                    <span>Shipping Services</span>
                  </Link>
                </TabsTrigger>
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
                      className="flex items-center gap-2"
                    >
                      <Box />
                      <span>Catalogs</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {canAccessOrders() && (
                <TabsTrigger value="orders" asChild>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart />
                    <span>Orders</span>
                  </Link>
                </TabsTrigger>
              )}

              {canAccessMarketplaces() && (
                <TabsTrigger value="marketplaces" asChild>
                  <Link
                    href="/dashboard/marketplaces"
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag />
                    <span>Marketplaces</span>
                  </Link>
                </TabsTrigger>
              )}

              {canAccessUsers() && (
                <TabsTrigger value="users" asChild>
                  <Link
                    href="/dashboard/users"
                    className="flex items-center gap-2"
                  >
                    <Users />
                    <span>Users</span>
                  </Link>
                </TabsTrigger>
              )}

              {canAccessCustomers() && (
                <TabsTrigger value="customers" asChild>
                  <Link
                    href="/dashboard/customers"
                    className="flex items-center gap-2"
                  >
                    <Users2 />
                    <span>Customers</span>
                  </Link>
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
