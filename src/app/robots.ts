import type { MetadataRoute } from "next";

import { getBaseUrl } from "~/lib/utils";

const robots = () =>
  ({
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  }) satisfies MetadataRoute.Robots;

export default robots;

export const dynamic = "error";
