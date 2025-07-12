"use client";

import { useGetProductById } from "@/api/(front-office)/product/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ProductViewDetail() {
  const params = useParams();
  const productId = params.id;
  const { data: productResponse, isLoading } = useGetProductById(productId);
  const product = productResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/products">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Product Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for product ID: {productId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading product details...</p>}

      {!isLoading && product && (
        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">ID</TableCell>
                <TableCell>{product.id_produk}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{product.nama_produk}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell>
                  <Badge
                    className={
                      product.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Brand ID</TableCell>
                <TableCell>{product.id_brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Brand Name</TableCell>
                <TableCell>{product.brand?.nama_brand || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Category</TableCell>
                <TableCell>{product.kategori}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Price</TableCell>
                <TableCell>Rp{product.harga}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stock</TableCell>
                <TableCell>{product.stok}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Created At</TableCell>
                <TableCell>
                  {formatDateToIndonesian(product.created_at)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Updated At</TableCell>
                <TableCell>
                  {formatDateToIndonesian(product.updated_at)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !product && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Product not found</p>
        </div>
      )}
    </section>
  );
}
