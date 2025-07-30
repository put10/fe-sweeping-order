"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { useAddStockMutation } from "@/api/(front-office)/stock/mutation";
import { useGetStockByProduct } from "@/api/(front-office)/stock/queries";

const formSchema = z.object({
  id_produk: z.string().min(1, {
    message: "Please select a product.",
  }),
  jumlah: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  deskripsi: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
});

export function StockCreateForm({ onDialogClose }) {
  const mutation = useAddStockMutation();
  const { data: productData, isLoading } = useGetStockByProduct();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (productData?.data) {
      setProducts(productData.data);
    }
  }, [productData]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_produk: "",
      jumlah: 1,
      deskripsi: "",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="id_produk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.id_produk}
                      value={product.id_produk}
                    >
                      {product.nama_produk} - {product.brand.nama_brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jumlah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input id="jumlah" type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea id="deskripsi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding Stock..." : "Add Stock"}
        </Button>
      </form>
    </Form>
  );
}
