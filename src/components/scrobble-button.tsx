"use client";

import { useSetAtom } from "jotai";
import { type ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { type ButtonProps } from "~/components/ui/button";
import { type Tracks, type TracksResult } from "~/lib/queries/track";
import { scrobblesAtom } from "~/lib/store";
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
  const setScrobbles = useSetAtom(scrobblesAtom);

  const { mutate: scrobble } = api.track.scrobble.useMutation({
    onSuccess(data) {
      const tracksForAtom = data.tracks.map((track) => {
        const { timestamp: _timestamp, ...props } = track;
        return { ...props, status: "successful" as const };
      });

      void setScrobbles(tracksForAtom);
    },
    onError(_error, tracks) {
      const tracksForAtom = tracks.map((track) => {
        const { timestamp: _timestamp, ...props } = track;
        return { ...props, status: "failed" as const };
      });

      void setScrobbles(tracksForAtom);
    },
  });

  const startScrobble = (tracks: Tracks) => {
    //#region Put tracks in store

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

    //#endregion

    //#region Scrobble tracks

    const timestamps = generateTimestamps(date, tracks);

    const tracksToScrobble = tracksMappedBase.map((track, index) => ({
      ...track,
      timestamp: timestamps[index] ?? date / 1000,
    }));

    for (
      let index = 0;
      index < tracksToScrobble.length;
      index += scrobbleSize
    ) {
      scrobble(tracksToScrobble.slice(index, scrobbleSize + index));
    }

    //#endregion
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
