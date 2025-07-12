import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { MarketplaceTable } from "@/components/(front-office)/marketplace/marketplace-table";

export default function MarketplacePage() {
  return (
    <>
      <ContentLayout>
        <div className="mb-6">
          <h2 className="text-xl font-bold">Marketplaces</h2>
          <p className="text-muted-foreground text-sm">
            Browse all available marketplaces
          </p>
        </div>
        <MarketplaceTable />
      </ContentLayout>
    </>
  );
}
