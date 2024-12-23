import type { MetadataRoute } from "next";

import { env } from "~/env";

const robots = () =>
  ({
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${env.NEXT_PUBLIC_PROD_BASE_URL}/sitemap.xml`,
  }) satisfies MetadataRoute.Robots;

export default robots;

export const dynamic = "error";
