"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PackingTableReady } from "./packing-table-ready";
import { PackingTable } from "./packing-table";

export function PackingTab() {
  const [activeTab, setActiveTab] = useState("is-being-processed");

  return (
    <Tabs
      defaultValue="is-being-processed"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="is-being-processed">Packing Ready</TabsTrigger>
        <TabsTrigger value="packed-orders">Packed Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="is-being-processed">
        <PackingTableReady />
      </TabsContent>

      <TabsContent value="packed-orders">
        <PackingTable />
      </TabsContent>
    </Tabs>
  );
}
