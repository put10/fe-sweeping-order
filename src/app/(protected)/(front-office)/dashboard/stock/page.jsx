import { StockTab } from "@/components/(front-office)/stock/stock-tab";
import ContentLayout from "@/components/template/content/(front-office)/content-layout";

export default function StockPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Stock Management</h2>
        <p className="text-muted-foreground text-sm">
          Manage product inventory, view stock history, and track stock
          movements.
        </p>
      </div>

      <StockTab />
    </ContentLayout>
  );
}
