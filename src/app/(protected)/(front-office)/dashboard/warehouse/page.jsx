import { WarehouseTable } from "@/components/(front-office)/warehouse/warehouse-table";
import ContentLayout from "@/components/template/content/(front-office)/content-layout";

export default function WarehousePage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Warehouses List</h2>
        <p className="text-muted-foreground text-sm">
          Manage and configure warehouses.
        </p>
      </div>

      <WarehouseTable />
    </ContentLayout>
  );
}
