"use client";

import { useGetPackingById } from "@/api/(front-office)/packing/queries";
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

export default function PackingViewDetail() {
  const params = useParams();
  const packingId = params.id;
  const { data: packingResponse, isLoading } = useGetPackingById(packingId);
  const packing = packingResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/packings">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Packing Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for packing ID: {packingId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading packing details...</p>}

      {!isLoading && packing && (
        <div className="space-y-6">
          {/* Packing Information */}
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
                  <TableCell>{packing.id_packing}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Packing Date</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(packing.tgl_packing)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date Added</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(packing.created_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Printing Information */}
          {packing.pencetakan_label && (
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
                      {formatDateToIndonesian(
                        packing.pencetakan_label.id_pencetakan,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium ">
                      Printing Date
                    </TableCell>
                    <TableCell>
                      {formatDateToIndonesian(
                        packing.pencetakan_label.tgl_pencetakan,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Tracking Number
                    </TableCell>
                    <TableCell>
                      {packing.pencetakan_label.no_resi || "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Order Information */}
          {packing.pencetakan_label?.pesanan && (
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
                      {packing.pencetakan_label.pesanan.id_pesanan}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Name</TableCell>
                    <TableCell>
                      {packing.pencetakan_label.pesanan.pembeli?.nama_pembeli ||
                        "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketplace</TableCell>
                    <TableCell>
                      {packing.pencetakan_label.pesanan.marketplace
                        ?.nama_marketplace || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Shipping Service
                    </TableCell>
                    <TableCell>
                      {packing.pencetakan_label.pesanan.jasa_pengiriman
                        ?.nama_jasa || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Price</TableCell>
                    <TableCell>
                      Rp{" "}
                      {Number(
                        packing.pencetakan_label.pesanan.total_harga,
                      ).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Order Status</TableCell>
                    <TableCell className="capitalize">
                      {packing.pencetakan_label.pesanan.status_pesanan
                        ? packing.pencetakan_label.pesanan.status_pesanan.replace(
                            /_/g,
                            " ",
                          )
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Order Created</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(
                        packing.pencetakan_label.pesanan.created_at,
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Order Items */}
          {packing.pencetakan_label?.pesanan?.pesanan_items &&
            packing.pencetakan_label.pesanan.pesanan_items.length > 0 && (
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
                      {packing.pencetakan_label.pesanan.pesanan_items.map(
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

          {/* Shipping Information */}
          {Array.isArray(packing.pengiriman) &&
          packing.pengiriman.length > 0 ? (
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
                    <TableCell>
                      {formatDateToIndonesian(
                        packing.pengiriman[0].id_pengiriman,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Shipping Date</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(
                        packing.pengiriman[0].tgl_pengiriman,
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border">
              <h3 className="text-lg font-medium p-4 border-b">
                Shipping Information
              </h3>
              <div className="p-4">
                <p className="text-muted-foreground">
                  No shipping information available.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !packing && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Packing record not found</p>
        </div>
      )}
    </section>
  );
}
