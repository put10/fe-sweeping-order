"use client";

import { useGetShippingById } from "@/api/(front-office)/shipping/queries";
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

export default function ShippingViewDetail() {
  const params = useParams();
  const shippingId = params.id;
  const { data: shippingResponse, isLoading } = useGetShippingById(shippingId);
  const shipping = shippingResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/shippings">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Shipping Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for shipping ID: {shippingId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading shipping details...</p>}

      {!isLoading && shipping && (
        <div className="space-y-6">
          {/* Shipping Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Shipping Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">
                    Shipping ID
                  </TableCell>
                  <TableCell>{shipping.id_pengiriman}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Packing ID</TableCell>
                  <TableCell>{shipping.id_packing}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Shipping Date</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(shipping.tgl_pengiriman)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tracking Number</TableCell>
                  <TableCell>
                    {shipping.packing?.pencetakan_label?.no_resi || "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Packing Information */}
          {shipping.packing && (
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
                    <TableCell>{shipping.packing.id_packing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Packing Date</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(shipping.packing.tgl_packing)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Printing Information */}
          {shipping.packing?.pencetakan_label && (
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
                    <TableCell>
                      {shipping.packing.pencetakan_label.id_pencetakan}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Printing Date</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(
                        shipping.packing.pencetakan_label.tgl_pencetakan,
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Order Information */}
          {shipping.packing?.pencetakan_label?.pesanan && (
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
                    <TableCell>
                      {shipping.packing.pencetakan_label.pesanan.id_pesanan}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Name</TableCell>
                    <TableCell>
                      {shipping.packing.pencetakan_label.pesanan.pembeli
                        ?.nama_pembeli || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketplace</TableCell>
                    <TableCell>
                      {shipping.packing.pencetakan_label.pesanan.marketplace
                        ?.nama_marketplace || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Shipping Service
                    </TableCell>
                    <TableCell>
                      {shipping.packing.pencetakan_label.pesanan.jasa_pengiriman
                        ?.nama_jasa || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Price</TableCell>
                    <TableCell>
                      Rp{" "}
                      {Number(
                        shipping.packing.pencetakan_label.pesanan.total_harga,
                      ).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Order Status</TableCell>
                    <TableCell className="capitalize">
                      {shipping.packing.pencetakan_label.pesanan.status_pesanan
                        ? shipping.packing.pencetakan_label.pesanan.status_pesanan.replace(
                            /_/g,
                            " ",
                          )
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Order Datetime
                    </TableCell>
                    <TableCell>
                      {formatDateToIndonesian(
                        shipping.packing.pencetakan_label.pesanan.created_at,
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Order Items */}
          {shipping.packing?.pencetakan_label?.pesanan?.pesanan_items &&
            shipping.packing.pencetakan_label.pesanan.pesanan_items.length >
              0 && (
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
                      {shipping.packing.pencetakan_label.pesanan.pesanan_items.map(
                        (item, index) => (
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
                        ),
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
        </div>
      )}

      {!isLoading && !shipping && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Shipping record not found</p>
        </div>
      )}
    </section>
  );
}
