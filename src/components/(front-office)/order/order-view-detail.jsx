"use client";

import { useGetOrdersById } from "@/api/(front-office)/order/queries";
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

export default function OrderViewDetail() {
  const params = useParams();
  const orderId = params.id;
  const { data: orderResponse, isLoading } = useGetOrdersById(orderId);
  const order = orderResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Order Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for order ID: {orderId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading order details...</p>}

      {!isLoading && order && (
        <div className="space-y-6">
          {/* Order Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Order Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">Order ID</TableCell>
                  <TableCell>{order.id_pesanan}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Price</TableCell>
                  <TableCell>Rp {order.total_harga}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className={"capitalize"}>
                    {order.status_pesanan}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Order datetime</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(order.created_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Customer Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Customer Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">Name</TableCell>
                  <TableCell>{order.pembeli.nama_pembeli}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Address</TableCell>
                  <TableCell>{order.pembeli.alamat}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Contact</TableCell>
                  <TableCell>{order.pembeli.kontak}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Marketplace Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Marketplace Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">Name</TableCell>
                  <TableCell>{order.marketplace.nama_marketplace}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Shipping Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Shipping Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">Name</TableCell>
                  <TableCell>{order.jasa_pengiriman.nama_jasa}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Estimated Time</TableCell>
                  <TableCell>
                    {order.jasa_pengiriman.estimasi_waktu} days
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Order Items */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.pesanan_items.map((item, index) => (
                  <TableRow key={item.id_pesanan_item}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.produk.nama_produk}</TableCell>
                    <TableCell>Rp {item.produk.harga}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>Rp {item.subtotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {!isLoading && !order && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Order not found</p>
        </div>
      )}
    </section>
  );
}
