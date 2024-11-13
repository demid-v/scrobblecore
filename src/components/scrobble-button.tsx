"use client";

import { useSetAtom } from "jotai";
import { type ReactNode, useRef } from "react";

import { Button } from "~/components/ui/button";
import { type ButtonProps } from "~/components/ui/button";
import { type Scrobble, scrobblesAtom } from "~/lib/store";
import { type AlbumTracks, type Tracks, api } from "~/trpc/react";

type TracksMapped = (Scrobble & { timestamp: number })[];

const isAlbumTrack = (track: Tracks[number]): track is AlbumTracks[number] =>
  Object.hasOwn(track, "duration") || Object.hasOwn(track, "album");

const generateTimestamps = (date: number, tracks: Tracks) => {
  const defaultDuration = 3 * 60 * 1000;

  return tracks
    .toReversed()
    .map((track) => {
      date -= isAlbumTrack(track)
        ? (track.duration ?? defaultDuration)
        : defaultDuration;

      return Math.floor(date / 1000);
    })
    .toReversed();
};

const scrobbleSize = 50;

const ScrobbleButton = ({
  tracks,
  children,
  ...props
}: {
  tracks: Tracks;
  children?: ReactNode;
} & ButtonProps) => {
  const tracksMapped = useRef<TracksMapped>([]);

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

  const startScrobble = () => {
    const date = Date.now();
    const timestamps = generateTimestamps(date, tracks);

    tracksMapped.current = tracks.map((track, index) => ({
      id: crypto.randomUUID(),
      track: track.name,
      artist: track.artist,
      ...(isAlbumTrack(track) && { album: track.album }),
      date,
      timestamp: timestamps[index] ?? date,
      status: "pending" as const,
    }));

    const tracksForStore = tracksMapped.current.map((track) => {
      const { timestamp: _qwe, ...props } = track;
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

  return (
    <Button
      onClick={() => {
        startScrobble();
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ScrobbleButton;
