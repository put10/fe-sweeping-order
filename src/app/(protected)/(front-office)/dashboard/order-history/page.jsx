import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import OrderHistoryTable from "@/components/(front-office)/order-history/order-history-table";

export default function OrderHistoryPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Orders History</h2>
        <p className="text-muted-foreground text-sm">
          Track and manage all client orders history
        </p>
      </div>
      <OrderHistoryTable />
    </ContentLayout>
  );
}
