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
import { useUpdateShippingServiceMutation } from "@/api/(front-office)/shipping-service/mutation";
import { toast } from "sonner";

const formSchema = z.object({
  nama_jasa: z.string().min(2, {
    message: "Shipping service name must be at least 2 characters.",
  }),
  estimasi_waktu: z.coerce.number().min(1, {
    message: "Estimated time must be at least 1.",
  }),
  tarif: z.coerce.number().min(0, {
    message: "Shipping service rate must be a non-negative number.",
  }),
});

export function ShippingServiceEditForm({ onDialogClose, shippingData }) {
  const mutation = useUpdateShippingServiceMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_jasa: "",
      estimasi_waktu: 1,
      tarif: 0,
    },
  });

  useEffect(() => {
    if (shippingData) {
      form.setValue("nama_jasa", shippingData.nama_jasa);
      form.setValue("estimasi_waktu", shippingData.estimasi_waktu);
      form.setValue("tarif", parseFloat(shippingData.tarif));
    }
  }, [shippingData, form]);

  function onSubmit(values) {
    if (!shippingData?.id_jasa) {
      toast.error("No shipping service ID provided for update");
      return;
    }

    mutation.mutate(
      {
        id_jasa: shippingData.id_jasa,
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
          name="nama_jasa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Jasa</FormLabel>
              <FormControl>
                <Input id="nama_jasa" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimasi_waktu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimasi Waktu (hari)</FormLabel>
              <FormControl>
                <Input id="estimasi_waktu" type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tarif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarif</FormLabel>
              <FormControl>
                <Input id="tarif" type="number" min="0" {...field} />
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
