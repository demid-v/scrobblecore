"use client";

import { useEffect } from "react";
import { type SetOptional } from "type-fest";

import { type AlbumForDB, saveViewedAlbum } from "~/lib/db";

export const ViewedAlbum = ({
  album,
}: {
  album: SetOptional<AlbumForDB, "name" | "artist">;
}) => {
  useEffect(() => {
    if (album.name == null || album.artist == null) return;

    void saveViewedAlbum(album as AlbumForDB);
  }, [album]);

  return null;
};
