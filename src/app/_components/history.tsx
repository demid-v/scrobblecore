"use client";

import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

import { scrobblesAtom } from "~/lib/store";

const History = () => {
  const scrobbles = useAtomValue(scrobblesAtom).toReversed();

  return (
    <ol>
      {scrobbles.map(({ id, artist, name, date, status }) => (
        <li
          key={id}
          className="gap-x-2 px-2 py-0.5 hover:bg-slate-100 [&:not(:last-child)]:border-b"
        >
          <div className="flex items-center justify-between gap-x-1 overflow-hidden">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <Link
                href={`/artists/${encodeURIComponent(artist)}`}
                className="text-xs font-medium"
              >
                {artist}
              </Link>
            </div>
            <time className="shrink-0 whitespace-nowrap text-xs">
              {new Date(date).toLocaleString()}
            </time>
          </div>
          <div className="flex justify-between gap-x-1">
            <div
              className="overflow-hidden text-ellipsis whitespace-nowrap"
              title={name}
            >
              {name}
            </div>
            <Image
              src={`/${status}.png`}
              alt="Album's image"
              width={16}
              height={16}
              className="my-auto ml-auto"
            />
          </div>
        </li>
      ))}
    </ol>
  );
};

export default History;
