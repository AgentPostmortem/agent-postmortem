import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/urls";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // "/admin" without a trailing slash on purpose: robots.txt matches on
      // prefix, so "/admin" covers both the dashboard at /admin and everything
      // under it, while "/admin/" would leave app/admin/page.tsx crawlable.
      // The others have no bare route, only tokenised children, so the slash
      // is right for them.
      disallow: ["/admin", "/api/", "/edit/", "/status/", "/unsubscribe/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
