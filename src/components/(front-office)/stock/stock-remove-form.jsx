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
import { useRemoveStockMutation } from "@/api/(front-office)/stock/mutation";
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

export function StockRemoveForm({ onDialogClose, productData }) {
  const mutation = useRemoveStockMutation();
  const { data: productsData, isLoading } = useGetStockByProduct();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [estimatedRemainingStock, setEstimatedRemainingStock] = useState(0);

  useEffect(() => {
    if (productsData?.data) {
      setProducts(productsData.data);
    }

    // If productData is provided (from table), pre-select it
    if (productData) {
      setSelectedProduct(productData);
      setEstimatedRemainingStock(productData.stok - 1); // Default quantity is 1
    }
  }, [productsData, productData]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_produk: productData?.id_produk || "",
      jumlah: 1,
      deskripsi: "",
    },
  });

  // When a product is selected, update the selectedProduct state and estimated stock
  const handleProductChange = (productId) => {
    const product = products.find((p) => p.id_produk === productId);
    setSelectedProduct(product);
    form.setValue("id_produk", productId);

    // Calculate estimated remaining stock based on current quantity input
    const currentQuantity = form.getValues("jumlah") || 1;
    setEstimatedRemainingStock(product.stok - currentQuantity);
  };

  // Update estimated stock when quantity changes
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    if (selectedProduct) {
      const remaining = selectedProduct.stok - quantity;
      setEstimatedRemainingStock(remaining >= 0 ? remaining : 0);
    }
  };

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
                onValueChange={handleProductChange}
                defaultValue={field.value}
                disabled={isLoading || !!productData}
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
                      {product.nama_produk} - {product.brand?.nama_brand}{" "}
                      (Stock: {product.stok})
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
              <FormLabel>Quantity to Remove</FormLabel>
              <FormControl>
                <Input
                  id="jumlah"
                  type="number"
                  min="1"
                  max={selectedProduct?.stok || 1}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleQuantityChange(e);
                  }}
                />
              </FormControl>
              {selectedProduct && (
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    Current stock: {selectedProduct.stok}
                  </p>
                  <p
                    className={
                      estimatedRemainingStock < 0
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    Estimated remaining stock:{" "}
                    {Math.max(0, estimatedRemainingStock)}
                  </p>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Removal</FormLabel>
              <FormControl>
                <Textarea id="deskripsi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending || estimatedRemainingStock < 0}
        >
          {mutation.isPending ? "Removing Stock..." : "Remove Stock"}
        </Button>
      </form>
    </Form>
  );
}
