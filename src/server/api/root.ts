import { albumRouter } from "~/server/api/routers/album";
import { authRouter } from "~/server/api/routers/auth";
import { trackRouter } from "~/server/api/routers/track";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { artistRouter } from "./routers/artist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  album: albumRouter,
  artist: artistRouter,
  track: trackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
