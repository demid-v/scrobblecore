"use client";

import DefaultSearchPage from "./default-search-page";

const HomePage = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <DefaultSearchPage title="Welcome to Scrobblecore">
    {children}
  </DefaultSearchPage>
);

export default HomePage;
