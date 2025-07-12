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
import { useUpdateMarketplaceMutation } from "@/api/(front-office)/marketplace/mutation";
import { toast } from "sonner";

const formSchema = z.object({
  nama_marketplace: z.string().min(2, {
    message: "Marketplace name must be at least 2 characters.",
  }),
});

export function MarketplaceEditForm({ onDialogClose, marketplaceData }) {
  const mutation = useUpdateMarketplaceMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_marketplace: "",
    },
  });

  useEffect(() => {
    if (marketplaceData) {
      form.setValue("nama_marketplace", marketplaceData.nama_marketplace);
    }
  }, [marketplaceData, form]);

  function onSubmit(values) {
    if (!marketplaceData?.id_marketplace) {
      toast.error("No marketplace ID provided for update");
      return;
    }

    mutation.mutate(
      {
        id_marketplace: marketplaceData.id_marketplace,
        ...values,
      },
      {
        onSuccess: () => {
          document.body.style.removeProperty("pointer-events");
          form.reset();
          onDialogClose?.();
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
          name="nama_marketplace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Marketplace</FormLabel>
              <FormControl>
                <Input id="nama_marketplace" type="text" {...field} />
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
