import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { PackingTable } from "@/components/(front-office)/packing/packing-table";

export default function PackingPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Packings</h2>
        <p className="text-muted-foreground text-sm">
          Monitor all packaging activities and statuses
        </p>
      </div>
      <PackingTable />
    </ContentLayout>
  );
}
