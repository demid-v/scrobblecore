import type { MetadataRoute } from "next";

const sitemap = async () => {
  const currentDate = new Date().toISOString();

  return ["/", "/search", "/albums", "/artists", "/tracks", "/track"].map(
    (route) => ({
      url: route,
      lastModified: currentDate,
      changeFrequency: "always",
    }),
  ) satisfies MetadataRoute.Sitemap;
};

export default sitemap;

export const dynamic = "error";
