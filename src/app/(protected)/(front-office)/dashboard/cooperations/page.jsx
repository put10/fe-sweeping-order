import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { CooperationTable } from "@/components/(front-office)/cooperation/cooperation-table";

export default function CooperationPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Cooperations</h2>
        <p className="text-muted-foreground text-sm">
          Manage all business cooperations or partnerships
        </p>
      </div>
      <CooperationTable />
    </ContentLayout>
  );
}
