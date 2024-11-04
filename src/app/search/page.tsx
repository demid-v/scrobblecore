import Albums from "~/app/_components/albums";
import { Suspense } from "react";

const AlbumsPage = async () => {
  return (
    <Suspense>
      <Albums />
    </Suspense>
  );
};

export default AlbumsPage;
