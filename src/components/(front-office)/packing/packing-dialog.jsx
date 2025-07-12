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
import { PackingImportForm } from "@/components/(front-office)/packing/packing-import-form";
import { UploadIcon } from "lucide-react";

export function PackingDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadIcon />
          Import Packing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Packing Data</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing packing data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <PackingImportForm onDialogClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
