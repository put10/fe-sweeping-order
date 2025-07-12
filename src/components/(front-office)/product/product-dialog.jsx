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
import { ProductCreateForm } from "@/components/(front-office)/product/product-create-form";
import { PlusIcon } from "lucide-react";

export function ProductDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Create Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Create a new product by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ProductCreateForm onDialogClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
