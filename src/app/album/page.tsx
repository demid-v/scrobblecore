"use client";

import { z } from "zod";
import { api } from "~/trpc/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Suspense } from "react";

const mbidSchema = z.object({ mbid: z.string() });
const namesSchema = z.object({ albumName: z.string(), artistName: z.string() });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paramsSchema = mbidSchema.or(namesSchema);

type MbidSchema = z.infer<typeof mbidSchema>;
type ParamsSchema = z.infer<typeof paramsSchema>;

const isMbid = (params: ParamsSchema): params is MbidSchema =>
  Object.hasOwn(params, "mbid");

const Album = () => {
  const searchParams = useSearchParams();

  const rawParams = Object.fromEntries(searchParams.entries());
  const params = z
    .object({ mbid: z.string() })
    .or(z.object({ albumName: z.string(), artistName: z.string() }))
    .parse(rawParams);

  const queryParams = isMbid(params)
    ? { term: "mbid" as const, ...params }
    : { term: "names" as const, ...params };

  const { data: album } = api.album.one.useQuery(queryParams);

  const imageSrc = album?.image[3]?.["#text"] ?? "";

  const scrobble = api.track.scrobble.useMutation();

  return (
    <div className="mx-9 mb-8">
      <div className="mx-auto max-w-6xl pt-6">
        <div className="w-full">
          <Image
            className="mx-auto"
            src={imageSrc === "" ? "/no-cover.png" : imageSrc}
            alt="Album's image"
            width={300}
            height={300}
          />
          <p className="pt-6 text-center">
            {album?.artist} - {album?.name}
          </p>
          <ol className="pt-10">
            {album?.tracks?.map((track) => (
              <li
                key={track["@attr"].rank}
                className="flex justify-between [&:not(:last-child)]:mb-3"
              >
                <span key={track["@attr"].rank}>{track.name}</span>
                <Button
                  onClick={() =>
                    scrobble.mutate({
                      track: track.name,
                      artist: album.artist,
                      album: album.name,
                      timestamp: Math.floor(Date.now() / 1000),
                      trackNumber: track["@attr"].rank,
                    })
                  }
                >
                  Scrobble
                </Button>
              </li>
            ))}
          </ol>
        </div>
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
