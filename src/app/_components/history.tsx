"use client";

import { useAtomValue } from "jotai";
import { scrobblesAtom } from "~/lib/store";

const History = () => {
  const scrobbles = useAtomValue(scrobblesAtom).toReversed();

  return (
    <ol>
      {scrobbles.map((scrobble) => (
        <p key={scrobble.id}>{JSON.stringify(scrobble)}</p>
      ))}
    </ol>
  );
};

export default History;
