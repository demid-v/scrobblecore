import Link from "next/link";
import { api } from "~/trpc/server";
import Image from "next/image";
import { Button } from "~/components/ui/button";

const TopTracks = async ({
  artistName,
  limit,
  isSection = false,
}: {
  artistName: string;
  limit: number;
  isSection?: boolean;
}) => {
  const tracks = await api.artist.topTracks({
    artistName,
    limit,
  });

  return (
    <section>
      {isSection && (
        <p className="mt-10 text-xl">
          <Link href={{ pathname: `/artists/${artistName}/tracks` }}>
            Tracks
          </Link>
        </p>
      )}
      <ul className="mt-6">
        {tracks.map(({ name, artist, image }) => (
          <li
            key={`${name}`}
            className="flex items-center justify-between px-2 py-1 hover:bg-slate-100 [&:not(:last-child)]:border-b"
          >
            <div className="flex items-center">
              <Image
                src={image}
                alt="Album's cover"
                width={34}
                height={34}
                className="mr-2"
              />
              <span>
                {artist} - {name}
              </span>
            </div>
            <form
              action={async () => {
                "use server";

                await api.track.scrobble([
                  {
                    id: crypto.randomUUID(),
                    track: name,
                    artist: artistName,
                    timestamp: Math.floor(Date.now() / 1000),
                  },
                ]);
              }}
            >
              <Button size={"sm"} type="submit">
                Scrobble
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TopTracks;
