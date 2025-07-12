import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { SweepingTable } from "@/components/(front-office)/sweeping-order/sweeping-table";

export default function SweepingOrderPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Sweeping Orders</h2>
        <p className="text-muted-foreground text-sm">
          Manage and process all sweeping order records
        </p>
      </div>
      <SweepingTable />
    </ContentLayout>
  );
}
