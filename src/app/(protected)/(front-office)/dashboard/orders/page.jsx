import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { OrderTable } from "@/components/(front-office)/order/order-table";

export default function OrderPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Orders</h2>
        <p className="text-muted-foreground text-sm">
          Track and manage all customer orders
        </p>
      </div>
      <OrderTable />
    </ContentLayout>
  );
}
