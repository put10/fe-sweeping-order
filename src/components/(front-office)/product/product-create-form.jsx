"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useProductMutation } from "@/api/(front-office)/product/mutation";
import { useGetAllBrand } from "@/api/(front-office)/brand/queries";

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

export function ProductCreateForm({ onDialogClose }) {
  const mutation = useProductMutation();
  const { data: brands } = useGetAllBrand();

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

  function onSubmit(values) {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onDialogClose?.();
      },
    });
  }

  return (
    <>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a brand" />
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
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
}
