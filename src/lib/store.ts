import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import cookies from "js-cookie";
import SuperJSON from "superjson";
import { type Simplify } from "type-fest";

import { type TrackToScrobble } from "./queries/track";

type Scrobble = Simplify<
  Pick<TrackToScrobble, "name" | "artist" | "album"> & {
    id: string;
    date: number;
    status: "pending" | "successful" | "failed";
  }
>;

type ScrobblesMap = Map<string, Scrobble>;

const convertScrobblesToMap = (newScrobbles: Scrobble[]) =>
  newScrobbles.reduce(
    (acc, scrobble) => acc.set(scrobble.id, scrobble),
    new Map<string, Scrobble>(),
  );

const scrobblesAtomWithStorage = atomWithStorage(
  "scrobbles",
  new Map<string, Scrobble>(),
  {
    getItem(key, initialValue) {
      if (typeof localStorage === "undefined") return initialValue;

      const scrobblesItem = localStorage.getItem(key);
      if (scrobblesItem === null) return initialValue;

      const userName = cookies.get("userName");
      if (typeof userName === "undefined") return initialValue;

      const users = SuperJSON.parse<Map<string, ScrobblesMap>>(scrobblesItem);
      const scrobbles = users.get(userName) ?? initialValue;

      return scrobbles;
    },

    setItem(key, scrobbles) {
      const userName = cookies.get("userName");

      if (typeof userName === "undefined") {
        throw new Error("Broken cookies.");
      }

      const scrobblesItem = localStorage.getItem(key);

      const usersScrobbles =
        scrobblesItem !== null
          ? SuperJSON.parse<Map<string, ScrobblesMap>>(scrobblesItem)
          : new Map<string, ScrobblesMap>();

      usersScrobbles.set(userName, scrobbles);
      localStorage.setItem(key, SuperJSON.stringify(usersScrobbles));
    },

    removeItem(key) {
      localStorage.removeItem(key);
    },

    subscribe(key, callback, initialValue) {
      const syncScrobbles = (e: StorageEvent) => {
        if (e.storageArea === localStorage && e.key === key) {
          const scrobblesItem = localStorage.getItem(key);
          if (scrobblesItem === null) return initialValue;

          const userName = cookies.get("userName");
          if (typeof userName === "undefined") return initialValue;

          const users =
            SuperJSON.parse<Map<string, ScrobblesMap>>(scrobblesItem);
          const scrobbles = users.get(userName) ?? initialValue;

          callback(scrobbles);
        }
      };

      if (
        typeof window !== "undefined" &&
        typeof window.addEventListener !== "undefined"
      ) {
        window.addEventListener("storage", syncScrobbles);
      }

      return () => {
        window.removeEventListener("storage", syncScrobbles);
      };
    },
  },
);

const scrobblesAtom = atom(
  (get) => {
    const scrobblesFilter = get(scrobblesFilterAtom);
    const allScrobbles = [...get(scrobblesAtomWithStorage).values()];

    if (scrobblesFilter === "all") return allScrobbles;

    return allScrobbles.filter(
      (scrobble) => scrobble.status === scrobblesFilter,
    );
  },
  (get, set, newScrobbles: Scrobble[]) => {
    const newScrobblesMap = convertScrobblesToMap(newScrobbles);

    const scrobblesToStore = new Map([
      ...get(scrobblesAtomWithStorage),
      ...newScrobblesMap,
    ]);

    try {
      set(scrobblesAtomWithStorage, scrobblesToStore);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      const scrobblesToSplice = [...get(scrobblesAtomWithStorage).values()];
      scrobblesToSplice.splice(
        scrobblesToSplice.length - newScrobbles.length * 2,
        newScrobbles.length * 2,
      );

      const oldScrobblesMap = convertScrobblesToMap(scrobblesToSplice);

      const scrobblesToStore = new Map([
        ...oldScrobblesMap,
        ...newScrobblesMap,
      ]);

      set(scrobblesAtomWithStorage, scrobblesToStore);
    }
  },
);

type ScrobblesFilter = "all" | Scrobble["status"];

const scrobblesFilterAtom = atom<ScrobblesFilter>("all");

export { scrobblesAtom, scrobblesFilterAtom };
export type { Scrobble, ScrobblesFilter };
