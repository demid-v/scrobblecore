import { z } from "zod";

import { env } from "~/env";
import { lastFmApiGet } from "~/lib/utils";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type RouterOutputs } from "~/trpc/react";

const albumTrackSchema = z.object({
  name: z.string(),
  artist: z.object({ name: z.string() }),
  duration: z.number().nullable(),
});

const albumSchema = z.object({
  album: z
    .object({
      name: z.string(),
      artist: z.string(),
      image: z.array(
        z.object({
          size: z.enum(["small", "medium", "large", "extralarge", "mega", ""]),
          "#text": z.string().url().or(z.string().max(0)),
        }),
      ),
      tracks: z
        .object({
          track: z.array(albumTrackSchema).or(albumTrackSchema),
        })
        .optional(),
    })
    .optional(),
});

const albumRouter = createTRPCRouter({
  one: privateProcedure
    .input(
      z.object({
        albumName: z.string(),
        artistName: z.string(),
      }),
    )
    .query(async ({ input: { artistName, albumName } }) => {
      const params = {
        method: "album.getinfo",
        format: "json",
        album: albumName,
        artist: artistName,
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const parsedResult = await lastFmApiGet(params).then((json) =>
        albumSchema.parse(json),
      );

      const {
        image: images,
        tracks: tracksObj,
        ...albumProps
      } = parsedResult.album ?? {};

      const image = images?.find((image) => image.size === "extralarge")?.[
        "#text"
      ];

      const tracks = (() => {
        if (typeof tracksObj === "undefined") return [];

        const tracksProp = tracksObj.track;
        const tracksArray = Array.isArray(tracksProp)
          ? tracksProp
          : [tracksProp];

        const tracks = tracksArray.map((track) => ({
          ...track,
          type: "album" as const,
          artist: track.artist.name,
          album: albumName,
        }));

        return tracks;
      })();

      const album = {
        ...albumProps,
        image,
        tracks,
      };

      return album;
    }),
});

type AlbumTracks = RouterOutputs["album"]["one"]["tracks"];

export default albumRouter;
export type { AlbumTracks };
