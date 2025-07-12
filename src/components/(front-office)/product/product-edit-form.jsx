"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProductMutation } from "@/api/(front-office)/product/mutation";
import { useGetAllBrand } from "@/api/(front-office)/brand/queries";
import { toast } from "sonner";

const formSchema = z.object({
  nama_produk: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  id_brand: z.string({
    required_error: "Brand is required",
  }),
  kategori: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  harga: z.coerce.number().nonnegative({
    message: "Price cannot be negative. Please enter 0 or higher.",
  }),
  stok: z.coerce.number().int().nonnegative({
    message: "Stock must be a whole number and cannot be negative.",
  }),
});

export function ProductEditForm({ onDialogClose, productData }) {
  const mutation = useUpdateProductMutation();
  const { data: brands } = useGetAllBrand();
  const [isFormReady, setIsFormReady] = useState(false);

  const brandOptions = brands?.data.map((brand) => ({
    value: brand.id_brand,
    label: brand.nama_brand,
  }));

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_produk: "",
      id_brand: "",
      kategori: "",
      harga: 0,
      stok: 0,
    },
  });

  const watchedBrandId = form.watch("id_brand");

  useEffect(() => {
    if (productData && brands?.data) {
      form.setValue("nama_produk", productData.nama_produk);
      form.setValue("id_brand", productData.id_brand);
      form.setValue("kategori", productData.kategori);
      form.setValue("harga", Number(productData.harga));
      form.setValue("stok", productData.stok);
      setIsFormReady(true);
    }
  }, [productData, brands, form]);

  function onSubmit(values) {
    if (!productData?.id_produk) {
      toast.error("No product ID provided for update");
      return;
    }

    mutation.mutate(
      {
        id_produk: productData.id_produk,
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

  const selectedBrandName =
    brandOptions?.find((option) => option.value === watchedBrandId)?.label ||
    "Select a brand";

  if (!isFormReady && productData) {
    return <div>Loading form data...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama_produk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input id="nama_produk" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>{selectedBrandName}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brandOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kategori"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <Input id="kategori" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="harga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input id="harga" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stok"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stok</FormLabel>
              <FormControl>
                <Input id="stok" type="number" {...field} />
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
