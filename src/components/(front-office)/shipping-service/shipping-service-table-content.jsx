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
import { ShippingServiceEditForm } from "./shipping-service-edit-form";

export function ShippingServiceTableContent(props) {
  const totalPages = Math.max(
    1,
    Math.ceil(props.totalItems / props.itemsPerPage),
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedShippingService, setSelectedShippingService] =
    useState(undefined);

  const handleEdit = (shippingService) => {
    setSelectedShippingService(shippingService);
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
                Shipping Service ID
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[200px]" : ""}
              >
                Service Name
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[120px]" : ""}
              >
                Est. Time (Days)
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[150px]" : ""}
              >
                Rate
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
                <TableCell colSpan={6} className="text-center py-4">
                  Loading shipping services...
                </TableCell>
              </TableRow>
            ) : props.currentData.length > 0 ? (
              props.currentData.map((shippingService, index) => (
                <TableRow key={shippingService.id_jasa}>
                  <TableCell>{props.startIndex + index + 1}</TableCell>
                  <TableCell
                    className={
                      props.needsHorizontalScroll
                        ? "overflow-hidden text-ellipsis"
                        : ""
                    }
                  >
                    {shippingService.id_jasa}
                  </TableCell>
                  <TableCell>{shippingService.nama_jasa}</TableCell>
                  <TableCell>{shippingService.estimasi_waktu}</TableCell>
                  <TableCell>Rp{shippingService.tarif}</TableCell>
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
                            href={`/dashboard/shipping-services/${shippingService.id_jasa}`}
                          >
                            <DropdownMenuItem>
                              <EyeIcon className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => handleEdit(shippingService)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              props.onDelete(shippingService.id_jasa)
                            }
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link
                        href={`/dashboard/shipping-services/${shippingService.id_jasa}`}
                      >
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
                <TableCell colSpan={6} className="text-center py-4">
                  {props.noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                Total Shipping Services: {props.totalItems}
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
              setSelectedShippingService(undefined);
            }, 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shipping Service</DialogTitle>
            <DialogDescription>
              Edit the shipping service details below and click update to save
              changes.
            </DialogDescription>
          </DialogHeader>
          <ShippingServiceEditForm
            shippingData={selectedShippingService}
            onDialogClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
