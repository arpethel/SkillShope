// Admin Alerts API
// GET /api/admin/alerts — recent warn + critical events only
// GET /api/admin/alerts?all=true — all audit events

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const showAll = req.nextUrl.searchParams.get("all") === "true";
  const days = Number(req.nextUrl.searchParams.get("days")) || 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const where = showAll
    ? { createdAt: { gte: since } }
    : { severity: { in: ["warn", "critical"] }, createdAt: { gte: since } };

  const events = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Summary counts
  const [total, critical, warn] = await Promise.all([
    prisma.auditLog.count({ where: { createdAt: { gte: since } } }),
    prisma.auditLog.count({ where: { severity: "critical", createdAt: { gte: since } } }),
    prisma.auditLog.count({ where: { severity: "warn", createdAt: { gte: since } } }),
  ]);

  return NextResponse.json({
    summary: { total, critical, warn, period: `${days}d` },
    events: events.map((e) => ({
      ...e,
      metadata: e.metadata ? JSON.parse(e.metadata) : null,
    })),
  });
}
