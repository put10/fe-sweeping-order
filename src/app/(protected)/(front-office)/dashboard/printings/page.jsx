import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { PrintingTable } from "@/components/(front-office)/printing/printing-table";

export default function PrintingPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Printings</h2>
        <p className="text-muted-foreground text-sm">
          Manage all printing jobs and requests
        </p>
      </div>
      <PrintingTable />
    </ContentLayout>
  );
}
