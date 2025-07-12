import { BrandTable } from "@/components/(front-office)/brand/brand-table";
import ContentLayout from "@/components/template/content/(front-office)/content-layout";

export default function BrandPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Brands</h2>
        <p className="text-muted-foreground text-sm">
          Browse all available brands
        </p>
      </div>
      <BrandTable />
    </ContentLayout>
  );
}
