"use client";

import { useGetBrandById } from "@/api/(front-office)/brand/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function BrandViewDetail() {
  const params = useParams();
  const brandId = params.id;
  const { data: brandResponse, isLoading } = useGetBrandById(brandId);
  const brand = brandResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/brands">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Brand Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for brand ID: {brandId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading brand details...</p>}

      {!isLoading && brand && (
        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">ID</TableCell>
                <TableCell>{brand.id_brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{brand.nama_brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell>
                  <Badge
                    className={
                      brand.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {brand.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Created At</TableCell>
                <TableCell>
                  {formatDateToIndonesian(brand.created_at)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Updated At</TableCell>
                <TableCell>
                  {formatDateToIndonesian(brand.updated_at)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !brand && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Brand not found</p>
        </div>
      )}
    </section>
  );
}
