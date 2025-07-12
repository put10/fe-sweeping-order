import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { ShippingTable } from "@/components/(front-office)/shipping/shipping-table";

export default function ShippingPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Shippings</h2>
        <p className="text-muted-foreground text-sm">
          Track all shipments and delivery statuses
        </p>
      </div>
      <ShippingTable />
    </ContentLayout>
  );
}
