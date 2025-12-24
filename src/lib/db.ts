import { Dexie, type EntityTable } from "dexie";
import cookies from "js-cookie";
import { type SetOptional, type Simplify } from "type-fest";

import { type AlbumTracks } from "~/server/api/routers/album";

import { type ScrobblesFilter } from "./store";

type UserTable = { id: number; name: string };

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

type ViewedAlbum = {
  name: string;
  artist: string;
  image: string | undefined;
  user: number;
  date: number;
};

type ScrobbleForDB = Omit<ScrobbleTable, "id" | "user">;
type UpdateScrobbles = {
  key: number;
  changes: { status: "successful" | "failed" };
}[];
type AlbumForDB = Simplify<Omit<ViewedAlbum, "id" | "user">>;

type Scrobble = Simplify<ScrobbleTable & { type: "db" }>;

const db = new Dexie("ScrobblecoreDB") as Dexie & {
  users: EntityTable<UserTable, "id">;
  scrobbles: EntityTable<ScrobbleTable, "id">;
  viewedAlbums: EntityTable<ViewedAlbum, "name" | "artist" | "user">;
};

db.version(1).stores({
  users: "++id, &name",
  scrobbles: "++id, status, user",
  viewedAlbums: "[name+artist+user], name, artist, user",
});

const getUser = async () => {
  const currentUser = cookies.get("userName");
  if (!currentUser) return;

  return await db.transaction("rw", db.users, async () => {
    const user = (await db.users.get({ name: currentUser }))?.id;
    const userId = user ? user : await db.users.add({ name: currentUser });

    return userId;
  });
};

const getScrobbles = async (status?: ScrobblesFilter) => {
  const currentUser = cookies.get("userName");
  if (!currentUser) return;

  return await db.transaction("r", [db.users, db.scrobbles], async () => {
    const user = (await db.users.get({ name: currentUser }))?.id;

    if (user === undefined) return [];

    return await db.scrobbles
      .where({
        user,
        ...(status && status !== "all" ? { status } : {}),
      })
      .toArray();
  });
};

const saveScrobbles = async (scrobbles: ScrobbleForDB[]) => {
  const user = await getUser();
  if (!user) return [];

  const scrobblesWithUser = scrobbles.map((scrobble) => ({
    ...scrobble,
    user,
  }));

  return await db.scrobbles.bulkAdd(scrobblesWithUser, { allKeys: true });
};

const updateScrobbles = async (changes: UpdateScrobbles) =>
  await db.scrobbles.bulkUpdate(changes);

const saveViewedAlbum = async (album: AlbumForDB) => {
  const user = await getUser();
  if (!user) return;

  return await db.transaction("rw", db.viewedAlbums, async () => {
    if ((await db.viewedAlbums.where({ user }).count()) > 10) {
      const lastViewedAlbum = (
        await db.viewedAlbums.where({ user }).sortBy("date")
      )[0]!;

      await db.viewedAlbums
        .where({
          name: lastViewedAlbum.name,
          artist: lastViewedAlbum.artist,
          user,
        })
        .delete();
    }

    try {
      await db.viewedAlbums.add({ ...album, user });
    } catch (error) {
      if (!(error instanceof Dexie.ConstraintError)) {
        throw error;
      }

      await db.viewedAlbums
        .where({ name: album.name, artist: album.artist, user })
        .delete();

      await db.viewedAlbums.add({ ...album, user });
    }
  });
};

const getViewedAlbums = async () => {
  const currentUser = cookies.get("userName");
  if (!currentUser) return [];

  const user = (await db.users.get({ name: currentUser }))?.id;
  if (user === undefined) return [];

  return await db.viewedAlbums
    .where({
      user,
    })
    .reverse()
    .sortBy("date");
};

export default db;
export {
  getScrobbles,
  saveScrobbles,
  updateScrobbles,
  saveViewedAlbum,
  getViewedAlbums,
};
export type {
  ScrobbleTable,
  Scrobble,
  ScrobbleForDB,
  UpdateScrobbles,
  AlbumForDB,
};
