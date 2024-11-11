import SearchBar from "~/app/_components/search-bar";

export default async function WithSearchBarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SearchBar />
      {children}
    </>
  );
}
