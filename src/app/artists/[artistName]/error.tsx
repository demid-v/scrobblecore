"use client";
import DefaultError from "next/error";

import DefaultSearchPage from "~/app/_components/default-search-page";

const Error = ({ error }: { error: Error & { digest?: string } }) => {
  if (error.message === "Artist not found")
    return <DefaultSearchPage title={error.message} />;

  return <DefaultError statusCode={500} />;
};

export default Error;
