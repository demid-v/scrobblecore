"use client";

import { useEffect } from "react";

import { saveViewedAlbum } from "~/lib/db";
import { Album } from "~/lib/queries/album";

export const ViewedAlbum = ({ album }: { album: Album }) => {
  useEffect(() => {
    if (album.name == null || album.artist == null) return;

    const viewedAlbum = {
      name: album.name,
      artist: album.artist,
      image: album.image,
      date: Date.now(),
    };

    void saveViewedAlbum(viewedAlbum);
  }, [album]);

  return null;
};
