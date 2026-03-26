import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skillshope.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [skills, bundles] = await Promise.all([
    prisma.skill.findMany({
      where: { reviewStatus: { in: ["approved", "pending"] } },
      select: { slug: true, updatedAt: true, featured: true },
    }),
    prisma.bundle.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    // Core pages
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/browse`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/bundles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/docs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },

    // Skill pages
    ...skills.map((skill) => ({
      url: `${siteUrl}/skills/${skill.slug}`,
      lastModified: skill.updatedAt,
      changeFrequency: "weekly" as const,
      priority: skill.featured ? 0.8 : 0.6,
    })),

    // Bundle pages
    ...bundles.map((bundle) => ({
      url: `${siteUrl}/bundles/${bundle.slug}`,
      lastModified: bundle.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // Doc pages
    ...[
      "installing", "publishing", "pricing", "json-schema",
      "api-reference", "cli-reference", "community-skills",
      "versioning", "security", "verification", "faq",
    ].map((page) => ({
      url: `${siteUrl}/docs/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
