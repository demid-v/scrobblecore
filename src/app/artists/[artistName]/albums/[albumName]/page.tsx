"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import DefaultSearchPage from "~/app/_components/default-search-page";
import ListSkeleton from "~/app/_components/list-skeleton";
import Tracks from "~/app/_components/tracks";
import { ViewedAlbum } from "~/app/_components/viewed-album";
import ImageWithFallback from "~/components/image-with-fallback";
import NoCover from "~/components/no-cover";
import ScrobbleButton from "~/components/scrobble-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { getAlbum } from "~/lib/queries/album";

const AlbumPage = () => {
  const { artistName: artistNameParam, albumName: albumNameParam } = useParams<{
    artistName: string;
    albumName: string;
  }>();

  const artistName = decodeURIComponent(artistNameParam);
  const albumName = decodeURIComponent(albumNameParam);

  const queryParams = { artistName, albumName };

  const {
    data: album,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["albums", queryParams],
    queryFn: () => getAlbum(queryParams),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedArtist, setEditedArtist] = useState(artistName);
  const [editedAlbum, setEditedAlbum] = useState(albumName);

  if (isError) return <DefaultSearchPage title="Album not found" />;
  if (isLoading || !album) return <AlbumSkeleton />;

  const editedTracks = album?.tracks.map((track) => ({
    ...track,
    ...(artistName !== editedArtist ? { artist: editedArtist } : {}),
    album: editedAlbum,
  }));

  return (
    <div className="w-full">
      <div className="mx-auto mb-10 flex max-w-170 gap-x-6">
        <ImageWithFallback
          src={album.image}
          alt="Album's image"
          width={300}
          height={300}
          defaultImage={<NoCover className="mx-auto h-75 w-75 p-10" />}
          fetchPriority="high"
          preload
        />
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex gap-x-1">
            <div className="mb-3 w-full overflow-hidden">
              <div className="mb-1 font-bold">
                {isEditing ? (
                  <Input
                    value={editedArtist}
                    onChange={(e) => setEditedArtist(e.target.value)}
                  />
                ) : (
                  <Link
                    href={`/artists/${encodeURIComponent(album.artist)}`}
                    className="line-clamp-2 text-ellipsis"
                  >
                    {editedArtist}
                  </Link>
                )}
              </div>
              <div className="text-lg">
                {isEditing ? (
                  <Input
                    value={editedAlbum}
                    onChange={(e) => setEditedAlbum(e.target.value)}
                  />
                ) : (
                  <div
                    className="line-clamp-2 text-ellipsis"
                    title={editedAlbum}
                  >
                    {editedAlbum}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="flex h-5 w-6 p-0"
                title={isEditing ? "Stop editing" : "Edit album info"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <Cross2Icon style={{ height: "12px", width: "12px" }} />
                ) : (
                  <Edit2 style={{ height: "12px", width: "12px" }} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex h-5 w-6 p-0"
                title="Reset album info"
                onClick={() => {
                  setEditedArtist(artistName);
                  setEditedAlbum(albumName);
                }}
              >
                <Undo2 style={{ height: "12px", width: "12px" }} />
              </Button>
            </div>
          </div>
          <div>
            <ScrobbleButton tracks={editedTracks}>
              Scrobble album
            </ScrobbleButton>
          </div>
        </div>
      </div>
      <Tracks tracks={album.tracks} isEnumerated />
      <ViewedAlbum album={album} />
    </div>
  );
};

const AlbumSkeleton = () => (
  <div>
    <div className="mx-auto mb-10 flex max-w-170 gap-x-6">
      <Skeleton className="h-75 w-75 rounded-none" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex">
          <div className="w-full">
            <Skeleton className="mb-3 h-5 max-w-36" />
            <Skeleton className="h-6 max-w-56" />
          </div>
          <div className="flex flex-col">
            <Button variant="ghost" disabled className="flex h-5 w-6 p-0">
              <Edit2 style={{ height: "12px", width: "12px" }} />
            </Button>
            <Button variant="ghost" disabled className="flex h-5 w-6 p-0">
              <Undo2 style={{ height: "12px", width: "12px" }} />
            </Button>
          </div>
        </div>
        <div>
          <Button disabled>Scrobble album</Button>
        </div>
      </div>
    </div>
    <ListSkeleton count={11} isEnimerated />
  </div>
);

export default AlbumPage;
