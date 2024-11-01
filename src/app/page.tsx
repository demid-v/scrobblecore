import Albums from "./_components/albums";
import { Suspense } from "react";

const Home = () => {
  return (
    <Suspense>
      <Albums />
    </Suspense>
  );
};

export default Home;
