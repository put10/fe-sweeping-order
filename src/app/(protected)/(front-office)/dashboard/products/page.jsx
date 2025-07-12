import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { ProductTable } from "@/components/(front-office)/product/product-table";

export default function ProductPage() {
  return (
    <>
      <ContentLayout>
        <div className="mb-6">
          <h2 className="text-xl font-bold">Products</h2>
          <p className="text-muted-foreground text-sm">
            Browse all available products
          </p>
        </div>
        <ProductTable />
      </ContentLayout>
    </>
  );
}
