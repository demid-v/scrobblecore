"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cross1Icon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  search: z.string().trim(),
});

type formSchema = z.infer<typeof formSchema>;

const SearchBarInner = (props: React.FormHTMLAttributes<HTMLFormElement>) => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q")?.toString();

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const pathname = usePathname();
  const router = useRouter();

  const setSearch = ({ search }: formSchema) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (search !== "") {
      newSearchParams.set("q", search);
    } else {
      newSearchParams.delete("q");
    }

    router.push(
      `${["/search", "/albums", "/tracks", "/artists"].includes(pathname) ? pathname : "/search"}?${newSearchParams.toString()}`,
    );
  };

  useEffect(() => {
    form.setValue("search", queryParam ?? "");
  }, [queryParam, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(setSearch)} {...props}>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center gap-x-1">
                  <Input type="text" placeholder="Search" {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push(pathname);
                    }}
                  >
                    <Cross1Icon />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const SearchBar = (props: React.FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <Suspense>
      <SearchBarInner {...props} />
    </Suspense>
  );
};

export default SearchBar;
