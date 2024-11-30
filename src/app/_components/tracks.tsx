import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import ScrobbleButton from "~/components/scrobble-button";
import { type Tracks as TypeTracks } from "~/lib/queries/track";

const Tracks = ({
  tracks,
  children,
  ...props
}: {
  tracks: TypeTracks;
  children?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>) => {
  if (tracks.length === 0) {
    return <div className="text-center text-xl font-medium">No results.</div>;
  }

  return (
    <section {...props}>
      {children}
      <ul>
        {tracks.map((track, index) => (
          <li
            key={`${index}`}
            className="flex h-10 items-center gap-2 px-2 py-0.5 hover:bg-slate-100 [&:not(:last-child)]:border-b"
          >
            {track.type === "track" && (
              <ImageWithFallback
                src={track.image}
                alt="Album's cover"
                width={34}
                height={34}
                defaultSrc="/no-artist-image.png"
                className="shrink-0"
                defaultClassName="p-1.5"
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
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Tracks;
