import { CustomerTable } from "@/components/(front-office)/customer/customer-table";
import ContentLayout from "@/components/template/content/(front-office)/content-layout";

export default function CustomersPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Customers</h2>
        <p className="text-muted-foreground text-sm">
          Manage all customer records, including their orders and profiles.
        </p>
      </div>
      <CustomerTable />
    </ContentLayout>
  );
}
