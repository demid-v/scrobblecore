"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { getViewedAlbums } from "~/lib/db";
import { cn } from "~/lib/utils";

import ViewAlbums from "./viewed-albums";

const DefaultSearchPage = ({
  title,
  children,
}: { title: string } & Readonly<{ children?: React.ReactNode }>) => {
  const albums = useLiveQuery(getViewedAlbums);

  if (albums === undefined) return null;

  const hasViewedAlbums = albums.length ?? 0 > 0;

  return (
    <div
      className={cn(
        !hasViewedAlbums &&
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      )}
    >
      <div
        className={cn("my-auto mb-12 text-center", hasViewedAlbums && "mt-5")}
      >
        <h1 className={cn("text-5xl font-semibold")}>{title}</h1>
        {children}
      </div>
      <ViewAlbums />
    </div>
  );
};

export default DefaultSearchPage;
