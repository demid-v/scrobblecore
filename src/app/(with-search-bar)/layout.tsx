import SearchBar from "~/app/_components/search-bar";

export default function WithSearchBarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SearchBar />
      {children}
    </>
  );
}
