"use client";

import { useGetCustomerById } from "@/api/(front-office)/customer/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CustomerViewDetail() {
  const params = useParams();
  const customerId = params.id;
  const { data: customerResponse, isLoading } = useGetCustomerById(customerId);
  const customer = customerResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Customer Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for customer ID: {customerId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading customer details...</p>}

      {!isLoading && customer && (
        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">ID</TableCell>
                <TableCell>{customer.id_pembeli}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{customer.nama_pembeli}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Address</TableCell>
                <TableCell>{customer.alamat}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Contact</TableCell>
                <TableCell>{customer.kontak}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Created At</TableCell>
                <TableCell>
                  {formatDateToIndonesian(customer.created_at)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Updated At</TableCell>
                <TableCell>
                  {formatDateToIndonesian(customer.updated_at)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !customer && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Customer not found</p>
        </div>
      )}
    </section>
  );
}
