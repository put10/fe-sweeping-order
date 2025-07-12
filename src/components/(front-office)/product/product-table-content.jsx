"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, MoreHorizontal, Pencil, Trash2Icon } from "lucide-react";
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductEditForm } from "./product-edit-form";

export function ProductTableContent(props) {
  const totalPages = Math.max(
    1,
    Math.ceil(props.totalItems / props.itemsPerPage),
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(undefined);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  return (
    <>
      <div
        className={
          props.needsHorizontalScroll ? "relative overflow-x-auto" : ""
        }
      >
        <Table className={props.needsHorizontalScroll ? "min-w-full" : ""}>
          <TableHeader>
            <TableRow>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[50px]" : ""}
              >
                No
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[180px]" : ""}
              >
                Product ID
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[200px]" : ""}
              >
                Product Name
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[200px]" : ""}
              >
                Status
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[150px]" : ""}
              >
                Brand
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[150px]" : ""}
              >
                Category
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[100px]" : ""}
              >
                Price
              </TableHead>
              <TableHead
                className={`sticky right-0 z-20 bg-white ${
                  props.needsHorizontalScroll
                    ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)] w-[100px]"
                    : ""
                }`}
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : props.currentData.length > 0 ? (
              props.currentData.map((product, index) => (
                <TableRow key={product.id_produk}>
                  <TableCell>{props.startIndex + index + 1}</TableCell>
                  <TableCell
                    className={
                      props.needsHorizontalScroll
                        ? "overflow-hidden text-ellipsis"
                        : ""
                    }
                  >
                    {product.id_produk}
                  </TableCell>
                  <TableCell>{product.nama_produk}</TableCell>
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
                  <TableCell>{product.brand?.nama_brand}</TableCell>
                  <TableCell>{product.kategori}</TableCell>
                  <TableCell>Rp{product.harga}</TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      props.needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    {props.hasAdminPrivileges ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link
                            href={`/dashboard/products/${product.id_produk}`}
                          >
                            <DropdownMenuItem>
                              <EyeIcon className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => props.onDelete(product.id_produk)}
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link href={`/dashboard/products/${product.id_produk}`}>
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="mr-2 h-4 w-4" /> View
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  {props.noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                Total Products: {props.totalItems}
              </TableCell>
              <TableCell
                className={`sticky right-0 ${
                  props.needsHorizontalScroll
                    ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                    : ""
                }`}
              ></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <PaginationLayout
        currentPage={props.currentPage}
        totalPages={totalPages}
        setCurrentPage={props.setCurrentPage}
      />

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            document.body.style.removeProperty("pointer-events");
          }
          setEditDialogOpen(open);
          if (!open) {
            setTimeout(() => {
              setSelectedProduct(undefined);
            }, 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Edit the product details below and click update to save changes.
            </DialogDescription>
          </DialogHeader>
          <ProductEditForm
            productData={selectedProduct}
            onDialogClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
