"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { getViewedAlbums } from "~/lib/db";

import Albums from "./albums";

const ViewAlbums = () => {
  const albums = useLiveQuery(getViewedAlbums);

  if (!albums || albums.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-xl">Recently viewed albums</h2>
      <Albums albums={albums} />
    </section>
  );
};

export default ViewAlbums;
