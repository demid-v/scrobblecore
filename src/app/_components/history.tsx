"use client";

import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

import { Separator } from "~/components/ui/separator";
import { type Scrobble, scrobblesAtom } from "~/lib/store";

const scrobbleStateRecord: Record<Scrobble["status"], string> = {
  pending: "Pending",
  successful: "Scrobbled",
  failed: "Failed to scrobble",
};

const History = () => {
  const scrobbles = useAtomValue(scrobblesAtom).toReversed();

  return (
    <ol>
      {scrobbles.map(({ id, artist, track: name, date, status }, index) => (
        <li key={id}>
          <div className="gap-x-2 rounded-sm px-2 py-0.5 hover:bg-popover-foreground/10">
            <div className="flex items-center justify-between gap-x-1 overflow-hidden">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                <Link
                  href={`/artists/${encodeURIComponent(artist)}`}
                  className="text-xs font-semibold"
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
                src={`/${status}.svg`}
                alt={scrobbleStateRecord[status]}
                width={16}
                height={16}
                title={scrobbleStateRecord[status]}
                className="my-auto ml-auto"
              />
            </div>
          </div>
          {index !== scrobbles.length - 1 && <Separator />}
        </li>
      ))}
    </ol>
  );
};

export default History;
