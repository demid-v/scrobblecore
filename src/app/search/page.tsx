import { api } from "~/trpc/server";
import SearchBar from "../_components/search-bar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const SearchResults = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};

  const searchQuery = Array.isArray(q) ? q.at(0) : q;
  const searchIsEmpty =
    typeof searchQuery === "undefined" || searchQuery === "";

  const albums = !searchIsEmpty
    ? await api.album.search({ albumName: searchQuery, limit: 10 })
    : [];

  const artists = !searchIsEmpty
    ? await api.artist.search({ artistName: searchQuery, limit: 10 })
    : [];

  const tracks = !searchIsEmpty
    ? await api.track.search({ trackName: searchQuery, limit: 10 })
    : [];

  return (
    <div className="mx-auto max-w-7xl pt-6">
      <SearchBar />
      <section>
        <p className="mt-10 text-xl">
          <Link href={{ pathname: "/search/albums", query: { q } }}>
            Albums
          </Link>
        </p>
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
          {albums.map(({ name, artist, image }) => (
            <div key={`${name}${artist}`}>
              <Link
                href={`/view/${encodeURIComponent(artist)}/${encodeURIComponent(name)}`}
              >
                <Image
                  src={image}
                  alt="Album's cover"
                  width={300}
                  height={300}
                />
              </Link>
              <p className="mt-2">
                {artist} - {name}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <p className="mt-10 text-xl">
          <Link href={{ pathname: "/search/artists", query: { q } }}>
            Artists
          </Link>
        </p>
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
          {artists.map(({ name, image }) => (
            <div key={name}>
              <Link href={`/view/${encodeURIComponent(name)}`}>
                <Image
                  src={image}
                  alt="Album's cover"
                  width={300}
                  height={300}
                />
              </Link>
              <p className="mt-2">{name}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <p className="mt-10 text-xl">
          <Link href={{ pathname: "/search/tracks", query: { q } }}>
            Tracks
          </Link>
        </p>
        <ul className="mt-6">
          {tracks.map(({ name, artist, image }) => (
            <li
              key={`${name}${artist}`}
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
              <Button
                size={"sm"}
                // onClick={() => {
                //   scrobble.mutate([
                //     {
                //       track: name,
                //       artist: artist,
                //       album: "album.name",
                //       timestamp: Math.floor(Date.now() / 1000),
                //     },
                //   ]);
                // }}
              >
                Scrobble
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SearchResults;
