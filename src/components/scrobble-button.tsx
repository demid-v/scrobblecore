"use client";

import { useSetAtom } from "jotai";
import { type ReactNode, useRef } from "react";

import { Button } from "~/components/ui/button";
import { type ButtonProps } from "~/components/ui/button";
import { type Tracks, type TracksResult } from "~/lib/queries/track";
import { type Scrobble, scrobblesAtom } from "~/lib/store";
import { api } from "~/trpc/react";

import { Skeleton } from "./ui/skeleton";

const generateTimestamps = (date: number, tracks: Tracks) => {
  let timestamp = Math.floor(date / 1000);
  const lastTimestamp = timestamp;
  const defaultDuration = 3 * 60;

  const shiftedTimestamps = tracks
    .toReversed()
    .map(
      (track) =>
        (timestamp -=
          track.type === "album"
            ? (track.duration ?? defaultDuration)
            : defaultDuration),
    )
    .toReversed();

  const timestamps = [...shiftedTimestamps.slice(1), lastTimestamp];

  return timestamps;
};

const scrobbleSize = 50;

const useScrobble = () => {
  const tracksToScrobble = useRef<
    (Omit<Scrobble, "status"> & { timestamp: number })[]
  >([]);

  const setScrobbles = useSetAtom(scrobblesAtom);

  const { mutate: scrobble } = api.track.scrobble.useMutation({
    onSettled() {
      if (tracksToScrobble.current.length === 0) return;
      scrobble(tracksToScrobble.current.splice(0, scrobbleSize));
    },
    onSuccess(data) {
      const tracksForAtom = data.tracks.map((track) => {
        const { timestamp: _timestamp, album: _album, ...props } = track;
        return { ...props, status: "successful" as const };
      });

      void setScrobbles(tracksForAtom);
    },
    onError(_error, tracks) {
      const tracksForAtom = tracks.map((track) => {
        const { timestamp: _timestamp, album: _album, ...props } = track;
        return { ...props, status: "failed" as const };
      });

      void setScrobbles(tracksForAtom);
    },
  });

  const startScrobble = (tracks: Tracks) => {
    const date = Date.now();

    const tracksMappedBase = tracks.map((track) => ({
      id: crypto.randomUUID(),
      track: track.name,
      artist: track.artist,
      date,
      ...(track.type === "album" && { album: track.album }),
    }));

    const tracksForStore = tracksMappedBase.map((track) => ({
      ...track,
      status: "pending" as const,
    }));

    setScrobbles(tracksForStore);

    const timestamps = generateTimestamps(date, tracks);

    tracksToScrobble.current = tracksMappedBase.map((track, index) => ({
      ...track,
      timestamp: timestamps[index] ?? date,
    }));

    scrobble(tracksToScrobble.current.splice(0, scrobbleSize));
  };

  return startScrobble;
};

const ScrobbleButton = ({
  children,
  tracks,
  ...props
}: {
  children?: ReactNode;
  tracks: Tracks;
} & ButtonProps) => {
  const startScrobble = useScrobble();

  return (
    <Button
      onClick={() => {
        startScrobble(tracks);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

const ScrobbleAllButton = ({
  children,
  query,
  ...props
}: {
  children?: ReactNode;
  query: TracksResult;
} & ButtonProps) => {
  if (query.isFetching) {
    return <Skeleton className="mx-auto mb-6 h-9 w-[110.89px] shrink-0" />;
  }

  if (!query.isSuccess) return null;

  return (
    <ScrobbleButton tracks={query.data.tracks} {...props}>
      {children}
    </ScrobbleButton>
  );
};

export default ScrobbleButton;
export { useScrobble, ScrobbleAllButton };
