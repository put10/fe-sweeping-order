"use client";

import { useGetMarketplaceById } from "@/api/(front-office)/marketplace/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MarketplaceViewDetail() {
  const params = useParams();
  const marketplaceId = params.id;
  const { data: marketplaceResponse, isLoading } =
    useGetMarketplaceById(marketplaceId);
  const marketplace = marketplaceResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/marketplaces">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Marketplace Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for marketplace ID: {marketplaceId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading marketplace details...</p>}

      {!isLoading && marketplace && (
        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">ID</TableCell>
                <TableCell>{marketplace.id_marketplace}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{marketplace.nama_marketplace}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Date Added</TableCell>
                <TableCell>
                  {formatDateToIndonesian(marketplace.created_at)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Modified</TableCell>
                <TableCell>
                  {formatDateToIndonesian(marketplace.updated_at)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !marketplace && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Marketplace not found</p>
        </div>
      )}
    </section>
  );
}
