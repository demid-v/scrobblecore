"use client";

import { z } from "zod";
import { api } from "~/trpc/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Suspense } from "react";

const mbidSchema = z.object({ mbid: z.string() });
const namesSchema = z.object({ albumName: z.string(), artistName: z.string() });
const paramsSchema = mbidSchema.or(namesSchema);

type MbidSchema = z.infer<typeof mbidSchema>;
type ParamsSchema = z.infer<typeof paramsSchema>;

const isMbid = (params: ParamsSchema): params is MbidSchema =>
  Object.hasOwn(params, "mbid");

const Album = () => {
  const searchParams = useSearchParams();

  const rawParams = Object.fromEntries(searchParams.entries());
  const params = paramsSchema.parse(rawParams);

  const queryParams = isMbid(params)
    ? { term: "mbid" as const, ...params }
    : { term: "names" as const, ...params };

  const { data: album } = api.album.one.useQuery(queryParams);

  const scrobble = api.track.scrobble.useMutation();

  return (
    <div className="mx-9 mb-8">
      <div className="mx-auto max-w-md pt-6">
        {album && (
          <div className="w-full">
            <Image
              className="mx-auto"
              src={album.image}
              alt="Album's image"
              width={300}
              height={300}
            />
            <p className="pt-6 text-center">
              {album?.artist} - {album?.name}
            </p>
            <ol className="pt-10">
              {album?.tracks.map((track) => (
                <li
                  key={track["@attr"].rank}
                  className="flex items-center justify-between px-2 py-0.5 hover:bg-slate-100 [&:not(:last-child)]:border-b"
                >
                  <span key={track["@attr"].rank}>{track.name}</span>
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    onClick={() => {
                      scrobble.mutate({
                        track: track.name,
                        artist: album.artist,
                        album: album.name,
                        timestamp: Math.floor(Date.now() / 1000),
                        trackNumber: track["@attr"].rank,
                      });
                    }}
                  >
                    Scrobble
                  </Button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

const AlbumWithSuspense = () => (
  <Suspense>
    <Album />
  </Suspense>
);

export default AlbumWithSuspense;
