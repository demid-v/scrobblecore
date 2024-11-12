"use client";

import { useSetAtom } from "jotai";
import { type ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { type ButtonProps } from "~/components/ui/button";
import { scrobblesAtom } from "~/lib/store";
import { type AlbumTracks, type Tracks, api } from "~/trpc/react";

const isTrackWithDuration = (
  track: Tracks[number],
): track is AlbumTracks[number] => Object.hasOwn(track, "duration");

const ScrobbleButton = ({
  tracks,
  children,
  ...props
}: {
  tracks: Tracks;
  children?: ReactNode;
} & ButtonProps) => {
  const setScrobbles = useSetAtom(scrobblesAtom);

  const { mutate: scrobble } = api.track.scrobble.useMutation({
    onMutate(tracks) {
      const trackForAtom = tracks.map((track) => ({
        id: track.id,
        name: track.track,
        artist: track.artist,
        date: track.date,
        status: "pending" as const,
      }));

      void setScrobbles(trackForAtom);
    },
    onSuccess(data) {
      const trackForAtom = data.tracks.map((track) => ({
        id: track.id,
        name: track.track,
        artist: track.artist,
        date: track.date,
        status: "successful" as const,
      }));

      void setScrobbles(trackForAtom);
    },
    onError(_error, tracks) {
      const trackForAtom = tracks.map((track) => ({
        id: track.id,
        name: track.track,
        artist: track.artist,
        date: track.date,
        status: "failed" as const,
      }));

      void setScrobbles(trackForAtom);
    },
  });

  return (
    <Button
      {...props}
      onClick={() => {
        const tracksToScrobble = tracks.map((track, index) => ({
          id: crypto.randomUUID(),
          track: track.name,
          artist: track.artist,
          date: Date.now(),
          timestamp:
            Math.floor(Date.now() / 1000) -
            (isTrackWithDuration(track) ? (track.duration ?? 3) : 3) *
              60 *
              (tracks.length - 1 - index),
        }));

        scrobble(tracksToScrobble);
      }}
    >
      {children}
    </Button>
  );
};

export default ScrobbleButton;
