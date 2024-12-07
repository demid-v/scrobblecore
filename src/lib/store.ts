import { atom } from "jotai";
import { RESET, atomWithReset } from "jotai/utils";
import cookies from "js-cookie";
import SuperJSON from "superjson";

export type Scrobble = {
  id: string;
  track: string;
  artist: string;
  album?: string | undefined;
  date: number;
  status: "pending" | "successful" | "failed";
};

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

export const scrobblesAtom = atom(
  (get) => [...get(baseScrobblesAtom).values()],
  (get, set, newScrobbles: Scrobble[] | typeof RESET) => {
    if (newScrobbles === RESET) {
      set(baseScrobblesAtom, new Map<string, Scrobble>());
      return;
    }

    const userName = cookies.get("userName");

    if (typeof userName === "undefined") {
      throw new Error("Broken cookies.");
    }

    //#region Set scrobbles

    const newScrobblesMap = convertScrobblesToMap(newScrobbles);

    const scrobblesToStore = new Map([
      ...get(baseScrobblesAtom),
      ...newScrobblesMap,
    ]);

    set(baseScrobblesAtom, scrobblesToStore);

    //#endregion

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
