"use client";

import DefaultSearchPage from "~/app/_components/default-search-page";

const Error = ({ error }: { error: Error & { digest?: string } }) => (
  <DefaultSearchPage title={error.message} />
);

export default Error;
