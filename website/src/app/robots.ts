export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_ORIGIN}/sitemap.xml`,
  };
}
