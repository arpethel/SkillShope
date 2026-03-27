import { NextRequest, NextResponse } from "next/server";
import { hashApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { key } = await req.json();

  if (!key || typeof key !== "string" || !key.startsWith("sk_")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const keyHash = hashApiKey(key);

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!apiKey) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  // Update last used
  prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsed: new Date() },
  }).catch(() => {});

  return NextResponse.json({
    name: apiKey.user.name,
    email: apiKey.user.email,
  });
}
