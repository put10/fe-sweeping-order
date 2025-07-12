import React from "react";
import QueryClientProviderWrapper from "@/components/template/query-client/query-client";

export default function LoginLayout({ children }) {
  return <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>;
}
