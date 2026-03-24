// Public Registry API — used by the CLI to look up skills
// GET /api/registry/<slug> — returns skill metadata + file list (not content)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const skill = await prisma.skill.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      type: true,
      isFree: true,
      price: true,
      installCmd: true,
      sourceUrl: true,
      compatibility: true,
      verified: true,
      files: { select: { filename: true } },
      author: { select: { name: true, publisherVerified: true } },
    },
  });

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...skill,
    files: skill.files.map((f) => f.filename),
    downloadUrl: `/api/deliver/${skill.id}`,
  });
}
