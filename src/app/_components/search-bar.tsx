"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import { Input } from "~/components/ui/input";

const SearchBarInner = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q")?.toString();

  const pathname = usePathname();
  const router = useRouter();

  const searchBar = useRef<HTMLInputElement>(null);

  const setSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const value = event.currentTarget.value;
    const newSearchParams = new URLSearchParams(searchParams);

    if (value !== "") {
      newSearchParams.set("q", value);
    } else {
      newSearchParams.delete("q");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    if (!searchBar.current) return;

    searchBar.current.value = queryParam ?? "";
  }, [queryParam]);

  return (
    <Input
      className="mb-6"
      ref={searchBar}
      type="text"
      placeholder="Search"
      onKeyDown={setSearch}
    />
  );
};

const SearchBar = () => (
  <Suspense>
    <SearchBarInner />
  </Suspense>
);

export default SearchBar;
