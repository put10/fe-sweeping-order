"use client";

import { useState, useMemo } from "react";
import {
  useGetOrdersSedangDikirim,
  useGetOrdersSedangDikirimByBrand,
} from "@/api/(front-office)/order/queries";
import OrderHistoryFilter from "./order-history-filter";
import { OrderHistoryTableContent } from "@/components/(front-office)/order-history/order-history-table-content";

export default function OrderHistoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const { data: allShippingOrders, isLoading: allShippingOrdersLoading } =
    useGetOrdersSedangDikirim();
  const { data: brandFilteredOrders, isLoading: brandFilteredOrdersLoading } =
    useGetOrdersSedangDikirimByBrand(selectedBrandId, {
      refetchOnWindowFocus: false,
    });

  const orders = selectedBrandId ? brandFilteredOrders : allShippingOrders;
  const isLoading = selectedBrandId
    ? brandFilteredOrdersLoading
    : allShippingOrdersLoading;

  // Generate brand options from the orders data
  const brandOptions = useMemo(() => {
    if (!allShippingOrders?.data) return [];

    const uniqueBrands = new Map();
    allShippingOrders.data.forEach((order) => {
      if (order.pesanan_items?.length > 0) {
        order.pesanan_items.forEach((item) => {
          if (item.produk?.brand) {
            uniqueBrands.set(item.produk.brand.id_brand, {
              value: item.produk.brand.id_brand,
              label: item.produk.brand.nama_brand,
            });
          }
        });
      }
    });

    return Array.from(uniqueBrands.values());
  }, [allShippingOrders]);

  const handleFilterChange = (brandId) => {
    setSelectedBrandId(brandId);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <OrderHistoryFilter
        brandOptions={brandOptions}
        onFilterChange={handleFilterChange}
        disabled={isLoading}
      />

      <div className="rounded-md border">
        <OrderHistoryTableContent
          key={selectedBrandId || "all"}
          orders={orders}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
