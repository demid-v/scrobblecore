import { atom } from "jotai";
import { RESET, atomWithReset } from "jotai/utils";
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

const getInitialScrobbles = () => {
  const emptyMap = new Map<string, Scrobble>();

  if (typeof localStorage === "undefined") return emptyMap;

  const scrobblesItem = localStorage.getItem("scrobbles");
  if (scrobblesItem === null) return emptyMap;

  const userName = cookies.get("userName");
  if (typeof userName === "undefined") return emptyMap;

  const users = SuperJSON.parse<Map<string, ScrobblesMap>>(scrobblesItem);
  const scrobbles = users.get(userName) ?? emptyMap;

  return scrobbles;
};

const baseScrobblesAtom = atomWithReset(getInitialScrobbles());

const scrobblesAtom = atom(
  (get) => {
    const scrobblesFilter = get(scrobblesFilterAtom);
    const allScrobbles = [...get(baseScrobblesAtom).values()];

    if (scrobblesFilter === "all") return allScrobbles;
    return allScrobbles.filter(
      (scrobble) => scrobble.status === scrobblesFilter,
    );
  },
  (get, set, newScrobbles: Scrobble[] | typeof RESET) => {
    if (newScrobbles === RESET) {
      set(baseScrobblesAtom, new Map<string, Scrobble>());
      return;
    }

    const userName = cookies.get("userName");

    if (typeof userName === "undefined") {
      throw new Error("Broken cookies.");
    }

    const newScrobblesMap = convertScrobblesToMap(newScrobbles);

    const scrobblesToStore = new Map([
      ...get(baseScrobblesAtom),
      ...newScrobblesMap,
    ]);

    set(baseScrobblesAtom, scrobblesToStore);

    //#region Persist scrobbles

    if (typeof localStorage === "undefined") return;

    const scrobblesItem = localStorage.getItem("scrobbles");

    const usersScrobbles =
      scrobblesItem !== null
        ? SuperJSON.parse<Map<string, ScrobblesMap>>(scrobblesItem)
        : new Map<string, ScrobblesMap>();

    const scrobbles =
      usersScrobbles.get(userName) ?? new Map<string, Scrobble>();

    const newScrobblesToPersist = new Map([...scrobbles, ...newScrobblesMap]);

    usersScrobbles.set(userName, newScrobblesToPersist);

    localStorage.setItem("scrobbles", SuperJSON.stringify(usersScrobbles));

    //#endregion
  },
);

type ScrobblesFilter = "all" | Scrobble["status"];

const scrobblesFilterAtom = atom<ScrobblesFilter>("all");

export { scrobblesAtom, scrobblesFilterAtom };
export type { Scrobble, ScrobblesFilter };
