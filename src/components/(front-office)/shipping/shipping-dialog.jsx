"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShippingImportForm } from "@/components/(front-office)/shipping/shipping-import-form";
import { UploadIcon } from "lucide-react";

export function ShippingDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadIcon />
          Import Shipping
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Shipping Data</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing shipping data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ShippingImportForm onDialogClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
