"use client";

import { useGetPrintingById } from "@/api/(front-office)/printing/queries";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PrintingViewDetail() {
  const params = useParams();
  const printingId = params.id;
  const { data: printingResponse, isLoading } = useGetPrintingById(printingId);
  const printing = printingResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/printings">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Printing Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for printing ID: {printingId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading printing details...</p>}

      {!isLoading && printing && (
        <div className="space-y-6">
          {/* Printing Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Printing Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">
                    Printing ID
                  </TableCell>
                  <TableCell>{printing.id_pencetakan}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Printing Date</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(printing.tgl_pencetakan)}
                  </TableCell>
                </TableRow>
                {/*<TableRow>*/}
                {/*  <TableCell className="font-medium">Created At</TableCell>*/}
                {/*  <TableCell>*/}
                {/*    {formatDateToIndonesian(printing.created_at)}*/}
                {/*  </TableCell>*/}
                {/*</TableRow>*/}
              </TableBody>
            </Table>
          </div>

          {/* Order Information */}
          {printing.pesanan && (
            <div className="rounded-md border">
              <h3 className="text-lg font-medium p-4 border-b">
                Order Information
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">
                      Order ID
                    </TableCell>
                    <TableCell>{printing.pesanan.id_pesanan}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Name</TableCell>
                    <TableCell>
                      {printing.pesanan.pembeli.nama_pembeli}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Marketplace Name
                    </TableCell>
                    <TableCell>
                      {printing.pesanan.marketplace.nama_marketplace}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Shipping Service
                    </TableCell>
                    <TableCell>
                      {printing.pesanan.jasa_pengiriman.nama_jasa}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Price</TableCell>
                    <TableCell>Rp {printing.pesanan.total_harga}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Order Status</TableCell>
                    <TableCell className="capitalize">
                      {printing.pesanan.status_pesanan
                        ? printing.pesanan.status_pesanan.replace(/_/g, " ")
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Order Datetime
                    </TableCell>
                    <TableCell>
                      {formatDateToIndonesian(printing.pesanan.created_at)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Order Items */}
          {printing.pesanan?.pesanan_items &&
            printing.pesanan.pesanan_items.length > 0 && (
              <div className="rounded-md border">
                <h3 className="text-lg font-medium p-4 border-b">
                  Order Items
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {printing.pesanan.pesanan_items.map((item, index) => (
                        <TableRow key={item.id_pesanan_item}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {item.produk?.nama_produk || "Product"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={"outline"}>
                              {item.produk?.brand?.nama_brand || "Brand"}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>
                            {item.produk
                              ? `Rp ${Number(item.produk.harga).toLocaleString("id-ID")}`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            Rp {Number(item.subtotal).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

          {/* Packing Information */}
          {printing.packing && printing.packing.length > 0 ? (
            <div className="rounded-md border">
              <h3 className="text-lg font-medium p-4 border-b">
                Packing Information
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">
                      Packing ID
                    </TableCell>
                    <TableCell>{printing.packing[0].id_packing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Packing Date</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(printing.packing[0].tgl_packing)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border">
              <h3 className="text-lg font-medium p-4 border-b">
                Packing Information
              </h3>
              <div className="p-4">
                <p className="text-muted-foreground">
                  No packing information available.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !printing && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Printing record not found</p>
        </div>
      )}
    </section>
  );
}
