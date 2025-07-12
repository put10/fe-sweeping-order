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
import { useUserMutation } from "@/api/(front-office)/user/mutation";

const formSchema = z.object({
  username: z.string({
    required_error: "Username is required.",
  }),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(6, "Password must be at least 6 characters."),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email("Invalid email format."),
  role: z.enum(
    [
      "CEO",
      "ADMIN_IT",
      "ORDER_STAFF",
      "WAREHOUSE_STAFF",
      "SHIPPING_STAFF",
      "MANAGER",
    ],
    {
      required_error: "Role is required.",
    },
  ),
});

export function UserCreateForm({ onDialogClose }) {
  const mutation = useUserMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: undefined,
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="ADMIN_IT">Admin IT</SelectItem>
                  <SelectItem value="ORDER_STAFF">Order Staff</SelectItem>
                  <SelectItem value="WAREHOUSE_STAFF">
                    Warehouse Staff
                  </SelectItem>
                  <SelectItem value="SHIPPING_STAFF">Shipping Staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
