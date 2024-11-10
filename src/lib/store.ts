import { atom } from "jotai";
import cookies from "js-cookie";
import SuperJSON from "superjson";

type Scrobble = {
  id: string;
  name: string;
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
  if (typeof localStorage === "undefined") return new Map<string, Scrobble>();

  const scrobblesItem = localStorage.getItem("scrobbles");

  if (scrobblesItem === null) return new Map<string, Scrobble>();

  const userName = cookies.get("userName") ?? "";
  const users = SuperJSON.parse<Map<string, ScrobblesMap>>(scrobblesItem);
  const scrobbles = users.get(userName) ?? new Map<string, Scrobble>();

  return scrobbles;
};

const baseScrobblesAtom = atom(getInitialScrobbles());

export const scrobblesAtom = atom(
  (get) => [...get(baseScrobblesAtom).values()],
  (get, set, newScrobbles: Scrobble[]) => {
    const newScrobblesMap = scrobblesToMap(
      newScrobbles,
      get(baseScrobblesAtom),
    );
    set(baseScrobblesAtom, newScrobblesMap);

    if (typeof localStorage === "undefined") return;

    const userName = cookies.get("userName") ?? "";
    const users = new Map([[userName, newScrobblesMap]]);
    const scrobbles = SuperJSON.stringify(users);

    localStorage.setItem("scrobbles", scrobbles);
  },
);
