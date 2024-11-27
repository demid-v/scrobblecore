import { atom } from "jotai";
import cookies from "js-cookie";
import SuperJSON from "superjson";

export type Scrobble = {
  id: string;
  track: string;
  artist: string;
  date: number;
  status: "pending" | "successful" | "failed";
};

type ScrobblesMap = Map<string, Scrobble>;

const scrobblesToMap = (newScrobbles: Scrobble[], scrobbles: ScrobblesMap) =>
  newScrobbles.reduce(
    (acc, scrobble) => acc.set(scrobble.id, scrobble),
    new Map<string, Scrobble>(scrobbles),
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

const baseScrobblesAtom = atom(getInitialScrobbles());

export const scrobblesAtom = atom(
  (get) => [...get(baseScrobblesAtom).values()],
  (get, set, newScrobbles: Scrobble[]) => {
    const userName = cookies.get("userName");

    if (typeof userName === "undefined") {
      throw new Error("Broken cookies.");
    }

    const newScrobblesMap = scrobblesToMap(
      newScrobbles,
      get(baseScrobblesAtom),
    );

    set(baseScrobblesAtom, newScrobblesMap);

    const isPending = newScrobbles.at(0)?.status === "pending";
    if (typeof localStorage === "undefined" || isPending) return;

    const scrobblesItem = localStorage.getItem("scrobbles");

    const users =
      scrobblesItem === null
        ? new Map<string, ScrobblesMap>()
        : SuperJSON.parse<Map<string, ScrobblesMap>>(scrobblesItem);

    const newUsers = new Map([...users, [userName, newScrobblesMap]]);
    const scrobbles = SuperJSON.stringify(newUsers);

    localStorage.setItem("scrobbles", scrobbles);
  },
);
