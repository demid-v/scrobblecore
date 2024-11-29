"use client";

import { useSetAtom } from "jotai";
import { type ReactNode, useRef } from "react";

import { Button } from "~/components/ui/button";
import { type ButtonProps } from "~/components/ui/button";
import { type Tracks } from "~/lib/queries/track";
import { type Scrobble, scrobblesAtom } from "~/lib/store";
import { api } from "~/trpc/react";

const generateTimestamps = (date: number, tracks: Tracks) => {
  let timestamp = date;
  const defaultDuration = 3 * 60;

  const shiftedTimestamps = tracks
    .toReversed()
    .map((track) =>
      Math.floor(
        (timestamp -=
          track.type === "album"
            ? (track.duration ?? defaultDuration) * 1000
            : defaultDuration * 1000) / 1000,
      ),
    )
    .toReversed();

  const timestamps = [...shiftedTimestamps.slice(1), date / 1000];

  return timestamps;
};

const scrobbleSize = 50;

export const useScrobble = () => {
  const tracksMapped = useRef<(Scrobble & { timestamp: number })[]>([]);

  const setScrobbles = useSetAtom(scrobblesAtom);

  const { mutate: scrobble } = api.track.scrobble.useMutation({
    onSettled() {
      if (tracksMapped.current.length === 0) return;
      scrobble(tracksMapped.current.splice(0, scrobbleSize));
    },
    onSuccess(data) {
      const trackForAtom = data.tracks.map((track) => {
        const { timestamp: _timestamp, album: _album, ...props } = track;
        return { ...props, status: "successful" as const };
      });

      void setScrobbles(trackForAtom);
    },
    onError(_error, tracks) {
      const trackForAtom = tracks.map((track) => {
        const { timestamp: _timestamp, album: _album, ...props } = track;
        return { ...props, status: "failed" as const };
      });

      void setScrobbles(trackForAtom);
    },
  });

  const startScrobble = (tracks: Tracks) => {
    const date = Date.now();
    const timestamps = generateTimestamps(date, tracks);

    tracksMapped.current = tracks.map((track, index) => ({
      id: crypto.randomUUID(),
      track: track.name,
      artist: track.artist,
      ...(track.type === "album" && { album: track.album }),
      date,
      timestamp: timestamps[index] ?? date,
      status: "pending" as const,
    }));

    const tracksForStore = tracksMapped.current.map((track) => {
      const { timestamp: _timestamp, ...props } = track;
      return props;
    });

    setScrobbles(tracksForStore);

    const tracksToScrobble = tracksMapped.current
      .splice(0, scrobbleSize)
      .map((track) => {
        const { status: _status, ...props } = track;
        return props;
      });

    scrobble(tracksToScrobble);
  };

  return startScrobble;
};

const ScrobbleButton = ({
  tracks,
  children,
  ...props
}: {
  tracks: Tracks;
  children?: ReactNode;
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

export default ScrobbleButton;
