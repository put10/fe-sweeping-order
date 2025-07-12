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
import { CustomerEditForm } from "./customer-edit-form";

export function CustomerTableContent(props) {
  const totalPages = Math.max(
    1,
    Math.ceil(props.totalItems / props.itemsPerPage),
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(undefined);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
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
                Customer ID
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[200px]" : ""}
              >
                Customer Name
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[250px]" : ""}
              >
                Address
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[150px]" : ""}
              >
                Contact
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
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : props.currentData.length > 0 ? (
              props.currentData.map((customer, index) => (
                <TableRow key={customer.id_pembeli}>
                  <TableCell>{props.startIndex + index + 1}</TableCell>
                  <TableCell
                    className={
                      props.needsHorizontalScroll
                        ? "overflow-hidden text-ellipsis"
                        : ""
                    }
                  >
                    {customer.id_pembeli}
                  </TableCell>
                  <TableCell>{customer.nama_pembeli}</TableCell>
                  <TableCell>{customer.alamat}</TableCell>
                  <TableCell>{customer.kontak}</TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      props.needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
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
                          href={`/dashboard/customers/${customer.id_pembeli}`}
                        >
                          <DropdownMenuItem>
                            <EyeIcon className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                        </Link>
                        {props.hasCustomerAccess && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleEdit(customer)}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                props.onDelete(customer.id_pembeli)
                              }
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                Total Customers: {props.totalItems}
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
              setSelectedCustomer(undefined);
            }, 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Edit the customer details below and click update to save changes.
            </DialogDescription>
          </DialogHeader>
          <CustomerEditForm
            customerData={selectedCustomer}
            onDialogClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
