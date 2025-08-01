"use client";

import { useAtomValue } from "jotai";
import { Redo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";

import { useScrobble } from "~/components/scrobble-button";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { type Scrobble, scrobblesAtom } from "~/lib/store";

const scrobbleStateRecord: Record<Scrobble["status"], string> = {
  pending: "Pending",
  successful: "Scrobbled",
  failed: "Failed to scrobble",
};

const Row = ({
  index,
  style,
  data: scrobbles,
}: ListChildComponentProps<Scrobble[]>) => {
  const scrobble = scrobbles.at(index)!;

  const startScrobble = useScrobble();

  return (
    <div key={scrobble.id} style={style}>
      <div className="gap-x-2 rounded-sm px-2 py-0.5 hover:bg-sidebar-accent">
        <div className="flex items-center justify-between gap-x-1.5">
          <div className="flex min-w-0 items-center gap-x-1 whitespace-nowrap">
            <Link
              href={`/artists/${encodeURIComponent(scrobble.artist)}`}
              className="overflow-hidden text-ellipsis text-xs font-semibold"
            >
              {scrobble.artist}
            </Link>
            {scrobble.album && (
              <Link
                href={`/artists/${encodeURIComponent(scrobble.artist)}/albums/${encodeURIComponent(scrobble.album)}`}
                className="overflow-hidden text-ellipsis text-xs"
              >
                {scrobble.album}
              </Link>
            )}
          </div>
          <time className="shrink-0 whitespace-nowrap text-xs">
            {new Date(scrobble.date).toLocaleString()}
          </time>
        </div>
        <div className="flex justify-between gap-x-1">
          <div
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            title={scrobble.name}
          >
            {scrobble.name}
          </div>
          <div className="flex shrink-0 gap-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-1.5"
              title={scrobble.status === "failed" ? "Retry" : "Scrobble again"}
              onClick={() => {
                startScrobble([scrobble], scrobble.status === "failed");
              }}
            >
              <Redo2 />
            </Button>
            <Image
              src={`/${scrobble.status}.svg`}
              alt={scrobbleStateRecord[scrobble.status]}
              width={16}
              height={16}
              title={scrobbleStateRecord[scrobble.status]}
              unoptimized
              className="my-auto ml-auto"
            />
          </div>
        </div>
      </div>
      {index !== scrobbles.length - 1 && <Separator />}
    </div>
  );
};

const History = () => {
  const scrobbles = useAtomValue(scrobblesAtom).toReversed();

  return (
    <div className="flex-1">
      <AutoSizer disableWidth>
        {({ height }) => (
          <List
            height={height}
            width="100%"
            itemCount={scrobbles.length}
            itemSize={45}
            itemData={scrobbles}
            className="pb-4"
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default History;
