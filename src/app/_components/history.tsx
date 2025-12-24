"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useAtom } from "jotai";
import { Edit2, Redo2 } from "lucide-react";
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
import { type ScrobbleTable as Scrobble, getScrobbles } from "~/lib/db";
import { scrobblesFilterAtom } from "~/lib/store";
import { cn } from "~/lib/utils";

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
          <div className="flex w-full min-w-0 items-center gap-x-1 overflow-hidden whitespace-nowrap">
            <div className={cn(scrobble.album && "max-w-[50%]")}>
              <div className="overflow-hidden text-ellipsis text-xs font-semibold">
                <Link href={`/artists/${encodeURIComponent(scrobble.artist)}`}>
                  {scrobble.artist}
                </Link>
              </div>
            </div>
            {scrobble.album && (
              <div className="overflow-hidden text-ellipsis text-xs">
                <Link
                  href={`/artists/${encodeURIComponent(scrobble.artist)}/albums/${encodeURIComponent(scrobble.album)}`}
                >
                  {scrobble.album}
                </Link>
              </div>
            )}
          </div>
          <time className="shrink-0 whitespace-nowrap text-xs">
            {new Date(scrobble.timestamp * 1000).toLocaleString()}
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
            {scrobble.status !== "pending" && (
              <div className="flex shrink-0 items-center gap-x-1">
                <Link
                  href={`/track/?${new URLSearchParams({ name: scrobble.name, artist: scrobble.artist, ...(scrobble.album !== undefined ? { album: scrobble.album } : {}) })}`}
                  className="flex h-4 w-4 items-center justify-center"
                >
                  <Edit2 size={12} />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 px-0"
                  title={
                    scrobble.status === "failed" ? "Retry" : "Scrobble again"
                  }
                  onClick={() => {
                    void startScrobble(
                      [{ ...scrobble, type: "db" }],
                      scrobble.status === "failed",
                    );
                  }}
                >
                  <Redo2 className="!h-3.5 !w-3.5" />
                </Button>
              </div>
            )}
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
  const [scrobblesFilter] = useAtom(scrobblesFilterAtom);
  const scrobbles = useLiveQuery(
    () => getScrobbles(scrobblesFilter),
    [scrobblesFilter],
  )?.toReversed();

  if (!scrobbles) return null;

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
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default History;
