import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const VALID_ROLES = [
  "CEO",
  "ADMIN_IT",
  "ORDER_STAFF",
  "WAREHOUSE_STAFF",
  "SHIPPING_STAFF",
  "MANAGER",
  "ADMIN",
];

// Role-based access control functions
const canAccessCooperations = (role) => {
  return ["CEO", "ADMIN"].includes(role);
};

const canAccessBrands = (role) => {
  return ["ADMIN_IT", "ADMIN"].includes(role);
};

const canAccessProducts = (role) => {
  return ["ADMIN_IT", "ADMIN"].includes(role);
};

const canAccessMarketplaces = (role) => {
  return ["ADMIN_IT", "ADMIN"].includes(role);
};

const canAccessOrders = (role) => {
  return ["ORDER_STAFF", "ADMIN"].includes(role);
};

const canAccessSweepingOrders = (role) => {
  return [
    "ORDER_STAFF",
    "MANAGER",
    "WAREHOUSE_STAFF",
    "SHIPPING_STAFF",
    "ADMIN",
  ].includes(role);
};

const canAccessPrintings = (role) => {
  return ["WAREHOUSE_STAFF", "MANAGER", "ADMIN"].includes(role);
};

const canAccessPackings = (role) => {
  return ["WAREHOUSE_STAFF", "SHIPPING_STAFF", "MANAGER", "ADMIN"].includes(
    role,
  );
};

const canAccessShippings = (role) => {
  return ["SHIPPING_STAFF", "MANAGER", "ADMIN"].includes(role);
};

const canAccessUsers = (role) => {
  return ["ADMIN_IT", "ADMIN"].includes(role);
};

const canAccessShippingServices = (role) => {
  return ["ADMIN_IT", "ADMIN"].includes(role);
};

const canAccessCustomers = (role) => {
  return ["ORDER_STAFF", "ADMIN"].includes(role);
};

// Function to check if user has access to the requested route
const hasAccessToRoute = (path, role) => {
  if (path === "/dashboard") return true;

  if (path.includes("/dashboard/cooperations") && !canAccessCooperations(role))
    return false;
  if (path.includes("/dashboard/brands") && !canAccessBrands(role))
    return false;
  if (path.includes("/dashboard/products") && !canAccessProducts(role))
    return false;
  if (path.includes("/dashboard/marketplaces") && !canAccessMarketplaces(role))
    return false;
  if (path.includes("/dashboard/orders") && !canAccessOrders(role))
    return false;
  if (
    path.includes("/dashboard/sweeping-orders") &&
    !canAccessSweepingOrders(role)
  )
    return false;
  if (path.includes("/dashboard/printings") && !canAccessPrintings(role))
    return false;
  if (path.includes("/dashboard/packings") && !canAccessPackings(role))
    return false;
  if (path.includes("/dashboard/shippings") && !canAccessShippings(role))
    return false;
  if (path.includes("/dashboard/users") && !canAccessUsers(role)) return false;
  if (
    path.includes("/dashboard/shipping-services") &&
    !canAccessShippingServices(role)
  )
    return false;
  if (path.includes("/dashboard/customers") && !canAccessCustomers(role))
    return false;

  return true;
};

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const headers = new Headers(req.headers);

  headers.set("x-current-path", path);

  const isLoginRoute = path === "/login";
  const isProtectedRoute =
    path.startsWith("/dashboard") || path.startsWith("/dashboard-bo");
  const isRootRoute = path === "/";

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const role = (await cookieStore).get("role")?.value;
  const username = (await cookieStore).get("username")?.value;

  const hasValidRole = role && VALID_ROLES.includes(role);
  const isAuthenticated = token && hasValidRole && username;

  if (isRootRoute) {
    return NextResponse.redirect(
      new URL(isAuthenticated ? "/dashboard" : "/login", req.nextUrl),
    );
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Check if user has permission to access the route
  if (isProtectedRoute && isAuthenticated && !hasAccessToRoute(path, role)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
