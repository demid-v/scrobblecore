"use client";

import { useSetAtom } from "jotai";
import { type ReactNode } from "react";
import { type SetRequired, type Simplify } from "type-fest";

import { Button } from "~/components/ui/button";
import { type ButtonProps } from "~/components/ui/button";
import {
  type TrackToScrobble,
  type Tracks,
  type TracksResult,
} from "~/lib/queries/track";
import { type Scrobble, scrobblesAtom } from "~/lib/store";
import { api } from "~/trpc/react";

import { Skeleton } from "./ui/skeleton";

const generateTimestamps = (date: number, tracks: TrackToScrobble[]) => {
  let timestamp = Math.floor(date / 1000);

  if (tracks.length < 2) return [timestamp];

  const lastTimestamp = timestamp;
  const defaultDuration = 3 * 60;

  const shiftedTimestamps = tracks
    .toReversed()
    .map((track) => (timestamp -= track.duration ?? defaultDuration))
    .toReversed();

  const timestamps = [...shiftedTimestamps.slice(1), lastTimestamp];

  return timestamps;
};

const scrobbleSize = 50;

const useScrobble = () => {
  const setScrobbles = useSetAtom(scrobblesAtom);

  const { mutate: scrobble } = api.track.scrobble.useMutation({
    onSuccess(data) {
      const scrobbles = data.tracks.map((track) => {
        const { timestamp: _timestamp, ...props } = track;
        const scrobble: Scrobble = { ...props, status: "successful" };

        return scrobble;
      });

      void setScrobbles(scrobbles);
    },
    onError(_error, tracks) {
      const scrobbles = tracks.map((track) => {
        const { timestamp: _timestamp, ...props } = track;
        const scrobble: Scrobble = { ...props, status: "failed" };

        return scrobble;
      });

      void setScrobbles(scrobbles);
    },
  });

  const startScrobble = (tracks: TrackToScrobble[], isRetry?: boolean) => {
    //#region Put tracks in store

    const date = isRetry ? (tracks.at(0)?.date ?? Date.now()) : Date.now();

    const tracksMappedBase = tracks.map((track) => ({
      ...track,
      ...(!isRetry && {
        id: crypto.randomUUID(),
      }),
      date,
    })) as Simplify<SetRequired<TrackToScrobble, "id"> & { date: number }>[];

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
    return <Skeleton className="mx-auto h-9 w-[110.89px] shrink-0" />;
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
