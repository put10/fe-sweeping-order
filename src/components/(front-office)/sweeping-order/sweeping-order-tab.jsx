"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { SweepingOrderTableReady } from "./sweeping-order-table-ready";
import { SweepingTable } from "./sweeping-table";

export function SweepingOrderTab() {
  const [activeTab, setActiveTab] = useState("sweeping-ready");

  return (
    <Tabs
      defaultValue="sweeping-ready"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="sweeping-ready">Sweeping Ready</TabsTrigger>
        <TabsTrigger value="sweeped-orders">Sweeped Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="sweeping-ready">
        <SweepingOrderTableReady />
      </TabsContent>

      <TabsContent value="sweeped-orders">
        <SweepingTable />
      </TabsContent>
    </Tabs>
  );
}
