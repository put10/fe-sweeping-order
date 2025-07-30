"use client";

import { useGetShippingServiceById } from "@/api/(front-office)/shipping-service/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShippingServiceViewDetail() {
  const params = useParams();
  const shippingId = params.id;
  const { data: shippingServiceResponse, isLoading } =
    useGetShippingServiceById(shippingId);
  const shippingService = shippingServiceResponse?.data;

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/shipping-services">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Shipping Service Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for shipping service ID: {shippingId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading shipping service details...</p>}

      {!isLoading && shippingService && (
        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">ID</TableCell>
                <TableCell>{shippingService.id_jasa}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Service Name</TableCell>
                <TableCell>{shippingService.nama_jasa}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Estimated Time (Days)
                </TableCell>
                <TableCell>{shippingService.estimasi_waktu}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rate</TableCell>
                <TableCell>Rp{shippingService.tarif}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Date Added</TableCell>
                <TableCell>
                  {formatDateToIndonesian(shippingService.created_at)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Modified</TableCell>
                <TableCell>
                  {formatDateToIndonesian(shippingService.updated_at)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !shippingService && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Shipping service not found</p>
        </div>
      )}
    </>
  );
}
