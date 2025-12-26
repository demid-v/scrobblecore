"use client";

import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { type ButtonProps } from "~/components/ui/button";
import { type UpdateScrobbles, saveScrobbles, updateScrobbles } from "~/lib/db";
import { type Tracks } from "~/lib/queries/track";
import { type Scrobble } from "~/lib/utils";
import { type Scrobble as QueryScrobble } from "~/server/api/routers/track";
import { api } from "~/trpc/react";

const scrobbleSize = 50;

const useScrobble = () => {
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

        const scrobble = {
          key: track.id,
          changes: {
            status:
              resultCode === "29" || scrobbleCode === "1"
                ? ("failed" as const)
                : ("successful" as const),
          },
        };

        return scrobble;
      });

      void updateScrobbles(scrobbles);
    },
    onError(_error, tracks) {
      const scrobbles = tracks.map((track) => {
        const scrobble = {
          key: track.id,
          changes: { status: "failed" as const },
        };

        return scrobble;
      });

      void updateScrobbles(scrobbles);
    },
  });

  useEffect(() => {
    if (isLimitExceeded) toast.error("Daily scrobble limit exceeded.");
  }, [isLimitExceeded]);

  const putTracksInStore = async (tracks: Scrobble, isRetry?: boolean) => {
    const getTimestamps = (() =>
      tracks.toReversed().reduce<number[]>((acc, track, index, tracks) => {
        const defaultTimestamp = Math.trunc(Date.now() / 1000);

        if ((isRetry && track.type === "db") || track.type === "form") {
          acc.push(track.timestamp ?? defaultTimestamp);
        } else if (index === 0) acc.push(defaultTimestamp);
        else if (track.type === "album" && track.duration !== null) {
          const prevTrack = tracks.at(index - 1)!;
          const sub =
            prevTrack.type === "album" && prevTrack.duration !== null
              ? prevTrack.duration
              : 3 * 60;

          acc.push(acc.at(index - 1)! - sub);
        } else acc.push(acc.at(index - 1)! - 3 * 60);

        return acc;
      }, []))().toReversed();

    const tracksForStore = tracks.map((track, index) => ({
      name: track.name,
      artist: track.artist,
      ...((track.type === "album" || track.type === "form") && {
        album: track.album,
      }),
      timestamp: getTimestamps[index]!,
      status: "pending" as const,
    }));

    const ids = await (async () => {
      if (isRetry) {
        const tracksForStore = tracks.map((track) => ({
          ...(track.type === "db" && { key: track.id }),
          changes: { status: "pending" },
        })) as unknown as UpdateScrobbles;

        await updateScrobbles(tracksForStore);

        const ids = tracksForStore.reduce<number[]>((previous, current) => {
          previous.push(current.key);
          return previous;
        }, []);
        return ids;
      } else return await saveScrobbles(tracksForStore);
    })();

    const tracksMappedBase = tracksForStore.map(
      ({ status: _status, ...props }, index) => ({
        ...props,
        id: ids[index]!,
      }),
    );

    return tracksMappedBase;
  };

  const scrobbleTracks = (tracksMappedBase: QueryScrobble) => {
    setIsLimitExceeded(false);

    for (
      let index = 0;
      index < tracksMappedBase.length;
      index += scrobbleSize
    ) {
      scrobble(tracksMappedBase.slice(index, scrobbleSize + index));
    }
  };

  const startScrobble = async (tracks: Scrobble, isRetry?: boolean) => {
    const tracksMappedBase = await putTracksInStore(tracks, isRetry);
    scrobbleTracks(tracksMappedBase);
  };

  return startScrobble;
};

const ScrobbleButton = ({
  children,
  tracks = [],
  ...props
}: {
  children?: ReactNode;
  tracks?: Tracks;
} & ButtonProps) => {
  const startScrobble = useScrobble();

  return (
    <Button
      onClick={() => {
        void startScrobble(tracks);
      }}
      disabled={tracks.length === 0}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ScrobbleButton;
export { useScrobble };
