"use client";

import { useGetSweepingOrderById } from "@/api/(front-office)/sweeping-order/queries";
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

export default function SweepingViewDetail() {
  const params = useParams();
  const sweepingId = params.id;
  const { data: sweepingResponse, isLoading } =
    useGetSweepingOrderById(sweepingId);
  const sweeping = sweepingResponse?.data;

  // Get printing, packing, and shipping data if available
  const printing = sweeping?.pesanan?.pencetakan_label?.[0];
  const packing = printing?.packing?.[0];
  const shipping = packing?.pengiriman?.[0];

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/sweeping-orders">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Sweeping Process Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for process ID: {sweepingId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading sweeping process details...</p>}

      {!isLoading && sweeping && (
        <div className="space-y-6">
          {/* Sweeping Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Sweeping Process Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">
                    Process ID
                  </TableCell>
                  <TableCell>{sweeping.id_proses}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Process Status</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        sweeping.status_proses === "done_interface"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : sweeping.status_proses === "not_interface"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : sweeping.status_proses === "completed"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : sweeping.status_proses === "processed"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {sweeping.status_proses
                        ? sweeping.status_proses.replace(/_/g, "-")
                        : "-"}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Processed By</TableCell>
                  <TableCell className={"capitalize"}>
                    {(
                      sweeping.user?.username ||
                      sweeping.id_user ||
                      ""
                    ).replace(/_/g, " ")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sweeping Date</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(sweeping.created_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* User Information */}
          {sweeping.user && (
            <div className="rounded-md border">
              <h3 className="text-lg font-medium p-4 border-b">
                User Information
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">
                      Username
                    </TableCell>
                    <TableCell>{sweeping.user.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{sweeping.user.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Role</TableCell>
                    <TableCell className="capitalize">
                      {sweeping.user.role}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Order Information */}
          {sweeping.pesanan && (
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
                    <TableCell>{sweeping.pesanan.id_pesanan}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Name</TableCell>
                    <TableCell>
                      {sweeping.pesanan.pembeli?.nama_pembeli ||
                        sweeping.pesanan.nama_pembeli}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketplace</TableCell>
                    <TableCell>
                      {sweeping.pesanan.marketplace?.nama_marketplace ||
                        sweeping.pesanan.id_marketplace}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Shipping Service
                    </TableCell>
                    <TableCell>
                      {sweeping.pesanan.jasa_pengiriman?.nama_jasa ||
                        sweeping.pesanan.id_jasa_pengiriman}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Price</TableCell>
                    <TableCell>
                      Rp{" "}
                      {Number(sweeping.pesanan.total_harga).toLocaleString(
                        "id-ID",
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Order Status</TableCell>
                    <TableCell className="capitalize">
                      {sweeping.pesanan.status_pesanan.replace(/_/g, " ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Order datetime
                    </TableCell>
                    <TableCell>
                      {formatDateToIndonesian(sweeping.pesanan.created_at)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Order Items */}
          {sweeping.pesanan?.pesanan_items &&
            sweeping.pesanan.pesanan_items.length > 0 && (
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
                      {sweeping.pesanan.pesanan_items.map((item, index) => (
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

          {/* Printing Information */}
          {printing && (
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
                    <TableCell className="font-medium">
                      Tracking Number
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {printing.no_resi}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Printing Date</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(printing.tgl_pencetakan)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Packing Information */}
          {packing && (
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
                </TableBody>
              </Table>
            </div>
          )}

          {/* Shipping Information */}
          {shipping && (
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
                    <TableCell className="font-medium">Shipping Date</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(shipping.tgl_pengiriman)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {!isLoading && !sweeping && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Sweeping process record not found</p>
        </div>
      )}
    </section>
  );
}
