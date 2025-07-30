"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { usePathname } from "next/navigation";
import StockInHistoryTable from "./stock-in-history-table";
import StockOutHistoryTable from "./stock-out-history-table";
import StockHistoryTable from "./stock-history-table";

export function StockTab() {
  const [activeTab, setActiveTab] = useState("stock-in");
  const pathname = usePathname();

  if (pathname === "/dashboard/history-stock") {
    return <StockHistoryTable />;
  }

  return (
    <Tabs
      defaultValue="products"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <div className="overflow-x-auto pb-2">
        <TabsList className="flex w-max min-w-full">
          <TabsTrigger value="stock-in">Stock In</TabsTrigger>
          <TabsTrigger value="stock-out">Stock Out </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="stock-in">
        <StockInHistoryTable />
      </TabsContent>

      <TabsContent value="stock-out">
        <StockOutHistoryTable />
      </TabsContent>
    </Tabs>
  );
}
