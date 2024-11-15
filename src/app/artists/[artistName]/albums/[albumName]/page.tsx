import Link from "next/link";

import Tracks from "~/app/_components/tracks";
import ImageWithFallback from "~/components/image-with-fallback";
import ScrobbleButton from "~/components/scrobble-button";
import { api } from "~/trpc/server";

const AlbumPage = async ({
  params,
}: {
  params: Promise<{ artistName: string; albumName: string }>;
}) => {
  const { artistName, albumName } = await params;

  const queryParams = {
    artistName: decodeURIComponent(artistName),
    albumName: decodeURIComponent(albumName),
  };

  const album = await api.album.one(queryParams);

  return (
    <div className="w-full text-center">
      <ImageWithFallback
        src={album.image}
        alt="Album's image"
        width={300}
        height={300}
        defaultSrc="/no-cover.png"
        className="mx-auto"
        defaultClassName="mx-auto p-10"
      />
      <p className="mt-3 font-bold">
        <Link
          href={`/artists/${encodeURIComponent(album.artist ?? artistName)}`}
        >
          {album.artist}
        </Link>
      </p>
      <p className="mt-1 break-all text-center text-lg">{album.name}</p>
      <ScrobbleButton tracks={album.tracks} className="mt-3">
        Scrobble album
      </ScrobbleButton>
      <Tracks tracks={album.tracks} className="mt-10" />
    </div>
  );
};

export default AlbumPage;
