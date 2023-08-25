"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { checkAuth } from "@/app/lib/auth";

const formSchema = z
  .object({
    key: z.string({
      required_error: "🔑 is required",
    }),
  })
  .required();

interface Props {
  onSubmit: (key: string) => Promise<boolean>;
}

export default function AuthForm({ onSubmit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    const { key } = values;
    const isLogged: boolean = await checkAuth(key);
    console.log("IS LOGGED: ", isLogged);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Got a 🔑 ?</FormLabel>
              <FormControl>
                <Input placeholder="Enter your key here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Validate</Button>
      </form>
    </Form>
  );
}
