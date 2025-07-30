"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PrintingTableReady } from "./printing-table-ready";
import { PrintingTable } from "./printing-table";

export function PrintingTab() {
  const [activeTab, setActiveTab] = useState("needs-to-be-sent");

  return (
    <Tabs
      defaultValue="needs-to-be-sent"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="needs-to-be-sent">Printing Ready</TabsTrigger>
        <TabsTrigger value="printed-orders">Printed Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="needs-to-be-sent">
        <PrintingTableReady />
      </TabsContent>

      <TabsContent value="printed-orders">
        <PrintingTable />
      </TabsContent>
    </Tabs>
  );
}
