"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ShippingTableReady } from "./shipping-table-ready";
import { ShippingTable } from "./shipping-table";

export function ShippingTab() {
  const [activeTab, setActiveTab] = useState("is-being-packed");

  return (
    <Tabs
      defaultValue="is-being-packed"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="is-being-packed">Shipping Ready</TabsTrigger>
        <TabsTrigger value="shipped-orders">Shipped Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="is-being-packed">
        <ShippingTableReady />
      </TabsContent>

      <TabsContent value="shipped-orders">
        <ShippingTable />
      </TabsContent>
    </Tabs>
  );
}
