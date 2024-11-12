import Image from "next/image";
import { type SearchTracks, type Tracks as TTracks } from "~/trpc/react";
import ScrobbleButton from "./scrobble-button";
import Link from "next/link";

const isTrackWithImage = (
  track: TTracks[number],
): track is SearchTracks[number] => Object.hasOwn(track, "image");

const Tracks = ({
  children,
  tracks,
  ...props
}: {
  children?: React.ReactNode;
  tracks: TTracks;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>) => (
  <section {...props}>
    {children}
    <ul>
      {tracks.map((track, index) => (
        <li
          key={`${index}`}
          className="flex items-center justify-between px-2 py-0.5 hover:bg-slate-100 [&:not(:last-child)]:border-b"
        >
          <div className="flex items-center">
            {isTrackWithImage(track) && (
              <Image
                src={track.image}
                alt="Album's cover"
                width={34}
                height={34}
                className="mr-2"
              />
            )}
            <div>
              <Link
                href={`/artists/${encodeURIComponent(track.artist)}`}
                className="mr-4 text-sm font-medium"
              >
                {track.artist}
              </Link>
              {track.name}
            </div>
          </div>
          <ScrobbleButton tracks={[track]} size="sm">
            Scrobble
          </ScrobbleButton>
        </li>
      ))}
    </ul>
  </section>
);

export default Tracks;
