import { ShippingServiceTable } from "@/components/(front-office)/shipping-service/shipping-service-table";
import ContentLayout from "@/components/template/content/(front-office)/content-layout";

export default function ShippingServicesPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Shipping Services List</h2>
        <p className="text-muted-foreground text-sm">
          Manage and configure shipping services.
        </p>
      </div>

      <ShippingServiceTable />
    </ContentLayout>
  );
}
