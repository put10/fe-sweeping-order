import { StockTab } from "@/components/(front-office)/stock/stock-tab";
import ContentLayout from "@/components/template/content/(front-office)/content-layout";

export default function HistoryStockPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">History Stock</h2>
        <p className="text-muted-foreground text-sm">
          This page displays the history of stock transactions, including stock
          in and stock out records. You can view detailed information about each
          transaction, including product names, quantities, descriptions, and
          dates.
        </p>
      </div>

      <StockTab />
    </ContentLayout>
  );
}
