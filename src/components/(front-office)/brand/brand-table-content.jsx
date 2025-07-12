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
import { EyeIcon, MoreHorizontal, Pencil, Trash2Icon } from "lucide-react";
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";
import { useEffect, useState } from "react";
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
import { BrandEditForm } from "./brand-edit-form";
import { Badge } from "@/components/ui/badge";

export function BrandTableContent(props) {
  const totalItems = props.brands?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.brands?.data?.slice(startIndex, endIndex) || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(undefined);

  // Check if user has admin privileges
  const hasAdminPrivileges =
    props.hasAdminPrivileges ||
    props.userRole === "ADMIN_IT" ||
    props.userRole === "ADMIN";

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    if (props.brands?.data) {
      const hasManyItems = props.brands.data.length > 10;
      const hasLongContent = props.brands.data.some(
        (brand) =>
          (brand.id_brand && brand.id_brand.length > 20) ||
          (brand.nama_brand && brand.nama_brand.length > 30),
      );
      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [props.brands]);

  return (
    <>
      <div className={needsHorizontalScroll ? "relative overflow-x-auto" : ""}>
        <Table className={needsHorizontalScroll ? "min-w-full" : ""}>
          <TableHeader>
            <TableRow>
              <TableHead className={needsHorizontalScroll ? "w-[50px]" : ""}>
                No
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[180px]" : ""}>
                Brand ID
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[200px]" : ""}>
                Brand Name
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[200px]" : ""}>
                Status
              </TableHead>
              <TableHead
                className={`sticky right-0 z-20 bg-white ${
                  needsHorizontalScroll
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
                <TableCell colSpan={5} className="text-center py-4">
                  Loading brand data...
                </TableCell>
              </TableRow>
            ) : currentData.length > 0 ? (
              currentData.map((brand, index) => (
                <TableRow key={brand.id_brand}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell
                    className={
                      needsHorizontalScroll
                        ? "overflow-hidden text-ellipsis"
                        : ""
                    }
                  >
                    {brand.id_brand}
                  </TableCell>
                  <TableCell>{brand.nama_brand}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        brand.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {brand.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    {hasAdminPrivileges ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href={`/dashboard/brands/${brand.id_brand}`}>
                            <DropdownMenuItem>
                              <EyeIcon className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleEdit(brand)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => props.onDelete(brand.id_brand)}
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link href={`/dashboard/brands/${brand.id_brand}`}>
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
                <TableCell colSpan={5} className="text-center py-4">
                  {props.debouncedSearch
                    ? "No brands found matching your search."
                    : "No brands found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Brands: {totalItems}</TableCell>
              <TableCell
                className={`sticky right-0 ${
                  needsHorizontalScroll
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
              setSelectedBrand(undefined);
            }, 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Edit the brand details below and click update to save changes.
            </DialogDescription>
          </DialogHeader>
          <BrandEditForm
            brandData={selectedBrand}
            onDialogClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
