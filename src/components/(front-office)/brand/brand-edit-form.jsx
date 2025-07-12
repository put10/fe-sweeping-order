"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateBrandMutation } from "@/api/(front-office)/brand/mutation";
import { toast } from "sonner";

const formSchema = z.object({
  nama_brand: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
});

export function BrandEditForm({ onDialogClose, brandData }) {
  const mutation = useUpdateBrandMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_brand: "",
    },
  });

  useEffect(() => {
    if (brandData) {
      form.setValue("nama_brand", brandData.nama_brand);
    }
  }, [brandData, form]);

  function onSubmit(values) {
    if (!brandData?.id_brand) {
      toast.error("No brand ID provided for update");
      return;
    }

    mutation.mutate(
      {
        id_brand: brandData.id_brand,
        ...values,
      },
      {
        onSuccess: () => {
          document.body.style.removeProperty("pointer-events");

          form.reset();
          if (onDialogClose) onDialogClose();
        },
      },
    );
  }

  useEffect(() => {
    return () => {
      document.body.style.removeProperty("pointer-events");
      form.reset();
    };
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Brand</FormLabel>
              <FormControl>
                <Input id="nama_brand" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
