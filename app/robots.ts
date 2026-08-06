import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/urls";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/edit/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
