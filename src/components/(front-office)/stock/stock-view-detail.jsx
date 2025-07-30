"use client";

import { useGetStockByHistoryProduct } from "@/api/(front-office)/stock/queries";
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

export default function StockViewDetail() {
  const params = useParams();
  const productId = params.id;
  const { data: stockResponse, isLoading } =
    useGetStockByHistoryProduct(productId);
  const productData = stockResponse?.data?.produk;
  const stockHistory = stockResponse?.data?.riwayat_stok || [];

  const formatTransactionType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/stock">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Product Stock Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for product ID: {productId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading product stock details...</p>}

      {!isLoading && productData && (
        <div className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">
                    Product ID
                  </TableCell>
                  <TableCell>{productData.id_produk}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Product Name</TableCell>
                  <TableCell>{productData.nama_produk}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Brand</TableCell>
                  <TableCell>{productData.brand?.nama_brand || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Category</TableCell>
                  <TableCell>{productData.kategori}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Warehouse</TableCell>
                  <TableCell>
                    {productData.gudang?.nama_gudang || "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Price</TableCell>
                  <TableCell>
                    Rp {parseInt(productData.harga).toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Current Stock</TableCell>
                  <TableCell>{productData.stok}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(productData.created_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Stock History</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Stock In</TableHead>
                    <TableHead>Stock Out</TableHead>
                    <TableHead>Remaining Stock</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {formatDateToIndonesian(item.created_at)}
                      </TableCell>
                      <TableCell>{item.stok_masuk}</TableCell>
                      <TableCell>{item.stok_keluar}</TableCell>
                      <TableCell>{item.stok_sisa}</TableCell>
                      <TableCell>{item.deskripsi}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.tipe_transaksi.includes("MASUK")
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {formatTransactionType(item.tipe_transaksi)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {stockHistory.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No stock history available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !productData && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Product not found</p>
        </div>
      )}
    </>
  );
}
