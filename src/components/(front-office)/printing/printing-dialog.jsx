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
import { PrintingImportForm } from "@/components/(front-office)/printing/printing-import-form";
import { UploadIcon } from "lucide-react";

export function PrintingDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadIcon />
          Import Printing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Printing Data</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing printing data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <PrintingImportForm onDialogClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
