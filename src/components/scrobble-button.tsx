"use client";

import { useSetAtom } from "jotai";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
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

type TracksMappedBase = Simplify<
  SetRequired<TrackToScrobble, "id"> & { date: number }
>[];

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
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

  const { mutate: scrobble } = api.track.scrobble.useMutation({
    onSuccess(data) {
      const parser = new DOMParser();

      const resultDom = parser.parseFromString(data.result, "text/xml");
      const resultCode = resultDom
        .getElementsByTagName("error")[0]
        ?.getAttribute("code");

      if (resultCode === "29") setIsLimitExceeded(true);

      const isIgnoredElements =
        resultDom.getElementsByTagName("ignoredMessage");

      const scrobbles = data.tracks.map((track, i) => {
        const isIgnoredElement = isIgnoredElements[i];
        const scrobbleCode = isIgnoredElement?.getAttribute("code");
        const message = isIgnoredElement?.textContent ?? "";

        if (scrobbleCode === "1")
          toast.error(`Failed to scrobble "${track.artist} - ${track.name}"`, {
            description: message,
          });

        const { timestamp: _timestamp, ...props } = track;
        const scrobble = {
          ...props,
          status:
            resultCode === "29" || scrobbleCode === "1"
              ? "failed"
              : "successful",
        } satisfies Scrobble;

        return scrobble;
      });

      void setScrobbles(scrobbles);
    },
    onError(_error, tracks) {
      const scrobbles = tracks.map((track) => {
        const { timestamp: _timestamp, ...props } = track;
        const scrobble = { ...props, status: "failed" } satisfies Scrobble;

        return scrobble;
      });

      void setScrobbles(scrobbles);
    },
  });

  useEffect(() => {
    if (isLimitExceeded) toast.error("Daily scrobble limit exceeded.");
  }, [isLimitExceeded]);

  const putTracksInStore = (tracks: TrackToScrobble[], isRetry?: boolean) => {
    const date = isRetry ? (tracks.at(0)?.date ?? Date.now()) : Date.now();

    const tracksMappedBase = tracks.map((track) => ({
      ...track,
      ...(!isRetry && {
        id: crypto.randomUUID(),
      }),
      date,
    })) as TracksMappedBase;

    const tracksForStore = tracksMappedBase.map((track) => ({
      ...track,
      status: "pending" as const,
    }));

    setScrobbles(tracksForStore);

    return { date, tracksMappedBase };
  };

  const scrobbleTracks = (
    tracks: TrackToScrobble[],
    date: number,
    tracksMappedBase: TracksMappedBase,
  ) => {
    const timestamps = generateTimestamps(date, tracks);

    const tracksToScrobble = tracksMappedBase.map((track, index) => ({
      ...track,
      timestamp: timestamps[index] ?? date / 1000,
    }));

    setIsLimitExceeded(false);

    for (
      let index = 0;
      index < tracksToScrobble.length;
      index += scrobbleSize
    ) {
      scrobble(tracksToScrobble.slice(index, scrobbleSize + index));
    }
  };

  const startScrobble = (tracks: TrackToScrobble[], isRetry?: boolean) => {
    const { date, tracksMappedBase } = putTracksInStore(tracks, isRetry);
    scrobbleTracks(tracks, date, tracksMappedBase);
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
    return (
      <Button className="shrink-0" disabled>
        Scrobble all
      </Button>
    );
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
