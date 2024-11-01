"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Input } from "~/components/ui/input";
import { type AlbumSearchBaseResult } from "~/trpc/react";

const SearchBar = ({
  fetchAlbum,
}: {
  fetchAlbum: AlbumSearchBaseResult["refetch"];
}) => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q")?.toString();

  const pathname = usePathname();
  const router = useRouter();

  const searchBar = useRef<HTMLInputElement>(null);

  const setSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const value = event.currentTarget.value;
    void fetchAlbum();

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
      ref={searchBar}
      type="text"
      placeholder="Search"
      onKeyDown={setSearch}
    />
  );
};

export default SearchBar;
