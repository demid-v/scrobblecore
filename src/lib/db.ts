import { Dexie, type EntityTable } from "dexie";
import cookies from "js-cookie";
import { type SetOptional, type Simplify } from "type-fest";

import { type AlbumTracks } from "~/server/api/routers/album";

type User = { id: number; name: string };

type ScrobbleTable = Simplify<
  SetOptional<
    Pick<AlbumTracks[number], "name" | "artist" | "album">,
    "album"
  > & {
    id: number;
    timestamp: number;
    status: "pending" | "successful" | "failed";
    user: number;
  }
>;

type Scrobble = Simplify<ScrobbleTable & { type: "db" }>;
type ScrobbleForDB = Omit<ScrobbleTable, "id" | "user">;

const db = new Dexie("ScrobblecoreDB") as Dexie & {
  user: EntityTable<User, "id">;
  scrobbles: EntityTable<ScrobbleTable, "id">;
};

db.version(1).stores({
  user: "++id, name",
  scrobbles: "++id, status",
});

const getAllScrobbles = async () => await db.scrobbles.toArray();

const saveScrobbles = async (scrobbles: ScrobbleForDB[]) => {
  const currentUser = cookies.get("userName")!;
  const user = await db.user.get({ name: currentUser });

  const userId = await (async () => {
    if (user) return user.id;

    return await db.user.add({ name: currentUser });
  })();

  const scrobblesWithUser = scrobbles.map((scrobble) => ({
    ...scrobble,
    user: userId,
  }));

  return await db.scrobbles.bulkAdd(scrobblesWithUser, { allKeys: true });
};

type UpdateScrobbles = {
  key: number;
  changes: { status: "successful" | "failed" };
}[];

const updateScrobbles = async (changes: UpdateScrobbles) =>
  await db.scrobbles.bulkUpdate(changes);

export default db;
export { getAllScrobbles, saveScrobbles, updateScrobbles };
export type { ScrobbleTable, Scrobble, ScrobbleForDB, UpdateScrobbles };
