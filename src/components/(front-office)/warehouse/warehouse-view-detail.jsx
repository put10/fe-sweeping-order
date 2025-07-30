"use client";

import { useGetWarehouseById } from "@/api/(front-office)/warehouse/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WarehouseViewDetail() {
  const params = useParams();
  const warehouseId = params.id;
  const { data: warehouseResponse, isLoading } =
    useGetWarehouseById(warehouseId);
  const warehouse = warehouseResponse?.data;

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/warehouse">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Warehouse Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for warehouse ID: {warehouseId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading warehouse details...</p>}

      {!isLoading && warehouse && (
        <div className="rounded-md border">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/4">ID</TableCell>
                <TableCell>{warehouse.id_gudang}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Warehouse Name</TableCell>
                <TableCell>{warehouse.nama_gudang}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Description</TableCell>
                <TableCell>{warehouse.keterangan}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell>
                  {warehouse.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      Inactive
                    </span>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Date Added</TableCell>
                <TableCell>
                  {formatDateToIndonesian(warehouse.created_at)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Modified</TableCell>
                <TableCell>
                  {formatDateToIndonesian(warehouse.updated_at)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Products</TableCell>
                <TableCell>
                  {warehouse.produk && warehouse.produk.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {warehouse.produk.map((product, index) => (
                        <li key={index}>
                          {product.nama_produk || "Unnamed product"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">
                      No products in this warehouse
                    </span>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && !warehouse && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Warehouse not found</p>
        </div>
      )}
    </>
  );
}
