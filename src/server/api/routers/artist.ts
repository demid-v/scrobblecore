import { z } from "zod";

import { env } from "~/env";
import { getTopAlbums, getTopTracks } from "~/lib/queries/artist";
import { lastFmApiGet } from "~/lib/utils";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const artistInfoSchema = z.object({
  artist: z
    .object({
      name: z.string(),
      image: z.array(
        z.object({
          size: z.enum(["small", "medium", "large", "extralarge", "mega", ""]),
          "#text": z.string().url().or(z.string().max(0)),
        }),
      ),
    })
    .optional(),
});

const artistRouter = createTRPCRouter({
  info: privateProcedure
    .input(z.object({ artistName: z.string() }))
    .query(async ({ input: { artistName } }) => {
      const params = {
        method: "artist.getinfo",
        format: "json",
        autocorrect: "1",
        artist: artistName,
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const artist = (
        await lastFmApiGet(params).then((json) => artistInfoSchema.parse(json))
      ).artist;

      return artist;
    }),

  topAlbums: privateProcedure
    .input(
      z.object({
        artistName: z.string(),
        limit: z.number().default(50),
        page: z.number().default(1),
      }),
    )
    .query(async ({ input }) => getTopAlbums(input)),

  topTracks: privateProcedure
    .input(
      z.object({
        artistName: z.string(),
        limit: z.number().default(50),
        page: z.number().default(1),
      }),
    )
    .query(async ({ input }) => getTopTracks(input)),
});

export default artistRouter;
