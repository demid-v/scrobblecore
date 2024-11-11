"use client";

import { useAtomValue } from "jotai";
import { scrobblesAtom } from "~/lib/store";
import Image from "next/image";
import Link from "next/link";

const History = () => {
  const scrobbles = useAtomValue(scrobblesAtom).toReversed();

  return (
    <ol>
      {scrobbles.map(({ id, artist, name, date, status }) => (
        <li
          key={id}
          className="gap-x-2 px-2 py-0.5 hover:bg-slate-100 [&:not(:last-child)]:border-b"
        >
          <div className="flex justify-between gap-x-1 overflow-hidden">
            <div className="overflow-hidden text-ellipsis text-nowrap">
              <Link
                href={`/artists/${encodeURIComponent(artist)}`}
                className="font-medium"
              >
                {artist}
              </Link>
            </div>
            <div className="shrink-0 text-xs">
              {new Date(date).toLocaleString()}
            </div>
          </div>
          <div className="flex shrink-0 justify-between gap-x-1">
            <div
              className="overflow-hidden text-ellipsis text-nowrap"
              title={name}
            >
              {name}
            </div>
            <Image
              src={`/${status}.png`}
              alt="Album's image"
              width={16}
              height={16}
              className="ml-auto"
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default History;
