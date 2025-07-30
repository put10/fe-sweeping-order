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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUpdateWarehouseMutation } from "@/api/(front-office)/warehouse/mutation";
import { toast } from "sonner";

const formSchema = z.object({
  nama_gudang: z.string().min(2, {
    message: "Warehouse name must be at least 2 characters.",
  }),
  keterangan: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  is_active: z.boolean().default(true),
});

export function WarehouseEditForm({ onDialogClose, warehouseData }) {
  const mutation = useUpdateWarehouseMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_gudang: "",
      keterangan: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (warehouseData) {
      form.setValue("nama_gudang", warehouseData.nama_gudang);
      form.setValue("keterangan", warehouseData.keterangan);
      form.setValue("is_active", warehouseData.is_active);
    }
  }, [warehouseData, form]);

  function onSubmit(values) {
    if (!warehouseData?.id_gudang) {
      toast.error("No warehouse ID provided for update");
      return;
    }

    mutation.mutate(
      {
        id_gudang: warehouseData.id_gudang,
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
          name="nama_gudang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Gudang</FormLabel>
              <FormControl>
                <Input id="nama_gudang" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea id="keterangan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
