import { api } from "~/trpc/server";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "~/app/_components/search-bar";

const AlbumsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};

  const searchQuery = Array.isArray(q) ? q.at(0) : q;
  const isSearchEmpty =
    typeof searchQuery === "undefined" || searchQuery === "";

  const albums = !isSearchEmpty
    ? await api.album.search({ albumName: searchQuery, limit: 50 })
    : [];

  return (
    <div className="mx-auto max-w-7xl pt-6">
      <SearchBar />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10 pt-10">
        {albums.map(({ name, artist, image }) => (
          <div key={`${name}${artist}`}>
            <Link
              href={`/view/${encodeURIComponent(artist)}/${encodeURIComponent(name)}`}
            >
              <Image src={image} alt="Album's cover" width={300} height={300} />
            </Link>
            <p className="mt-2">
              {artist} - {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumsPage;
