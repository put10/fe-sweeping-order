import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { ShippingTab } from "@/components/(front-office)/shipping/shipping-tab";

export default function ShippingPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Shippings</h2>
        <p className="text-muted-foreground text-sm">
          Manage all shipping operations and deliveries
        </p>
      </div>
      <ShippingTab />
    </ContentLayout>
  );
}
