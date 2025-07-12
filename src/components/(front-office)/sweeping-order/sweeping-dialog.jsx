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
import { SweepingImportForm } from "@/components/(front-office)/sweeping-order/sweeping-import-form";
import { UploadIcon } from "lucide-react";

export function SweepingDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadIcon />
          Import Sweeping Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Sweeping Order Data</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing sweeping order data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SweepingImportForm onDialogClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
