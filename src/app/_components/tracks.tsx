import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import NoArtistImage from "~/components/no-artist-image";
import ScrobbleButton from "~/components/scrobble-button";
import { Separator } from "~/components/ui/separator";
import { type Tracks as TypeTracks } from "~/lib/queries/track";

const Tracks = ({
  tracks,
  children,
}: {
  tracks: TypeTracks;
  children?: React.ReactNode;
}) => {
  if (tracks.length === 0) {
    return <div className="text-center text-xl font-medium">No tracks.</div>;
  }

  return (
    <section>
      {children}
      <ul>
        {tracks.map((track, index) => (
          <li key={`${index}`}>
            <div className="flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-popover-foreground/10">
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
              <div className="flex items-center overflow-hidden">
                <Link
                  href={`/artists/${encodeURIComponent(track.artist)}`}
                  className="mr-4 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold"
                >
                  {track.artist}
                </Link>
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
            {index !== tracks.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Tracks;
