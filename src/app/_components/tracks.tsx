import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import NoArtistImage from "~/components/no-artist-image";
import ScrobbleButton from "~/components/scrobble-button";
import { Separator } from "~/components/ui/separator";
import { type Tracks as TypeTracks } from "~/lib/queries/track";

const Tracks = ({
  tracks,
  isEnumerated,
  children,
}: {
  tracks: TypeTracks;
  isEnumerated?: boolean;
  children?: React.ReactNode;
}) => {
  if (tracks.length === 0) {
    return (
      <div className="mb-6 text-center text-xl font-medium">No tracks.</div>
    );
  }

  return (
    <section>
      {children}
      <ul>
        {tracks.map((track, index) => (
          <li key={`${index}`}>
            <div className="flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-accent">
              {isEnumerated && (
                <div
                  className="w-7 shrink-0 overflow-hidden text-ellipsis text-center text-xs"
                  title={`${index + 1}`}
                >
                  {index + 1}
                </div>
              )}
              <div className="flex grow items-center gap-x-2 overflow-hidden">
                {track.type === "track" && (
                  <ImageWithFallback
                    src={track.image}
                    alt="Artist's image"
                    width={34}
                    height={34}
                    defaultImage={
                      <NoArtistImage className="hidden h-full w-full shrink-0 p-10" />
                    }
                    className="hidden shrink-0"
                  />
                )}
                <div className="flex w-full items-center gap-x-4 overflow-hidden">
                  <div className="max-w-[50%]">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold">
                      <Link
                        href={`/artists/${encodeURIComponent(track.artist)}`}
                        className=""
                      >
                        {track.artist}
                      </Link>
                    </div>
                  </div>
                  <div
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    title={track.name}
                  >
                    {track.name}
                  </div>
                </div>
                <ScrobbleButton
                  tracks={[track] as TypeTracks}
                  size="sm"
                  className="ml-auto"
                >
                  Scrobble
                </ScrobbleButton>
              </div>
            </div>
            {index !== tracks.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Tracks;
