import { atom } from "jotai";

type ScrobblesFilter = "all" | "pending" | "successful" | "failed";

const scrobblesFilterAtom = atom<ScrobblesFilter>("all");

export { scrobblesFilterAtom };
export type { ScrobblesFilter };
