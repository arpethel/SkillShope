---
name: nextjs-observability
description: >-
  Production observability for Next.js apps. Structured audit logging, smart
  alerting, transaction tracking, error monitoring, and health checks. Use
  when adding logging, monitoring, or alerting to a Next.js + Prisma app.
  Built and used in production by Skill Shope.
---

# Next.js Observability

Add production-grade observability to your Next.js app. Audit logging, smart alerting, health checks, and transaction tracking — without external dependencies.

## Architecture

```
src/lib/
  audit.ts          — Non-blocking structured audit logger
  health.ts         — Health check endpoint factory
src/app/api/
  admin/alerts/     — Smart alert surface (warn + critical only)
  health/           — System health endpoint
```

## Step 1: Structured Audit Logger

Create `src/lib/audit.ts`:

```typescript
import { prisma } from "./prisma";

type Severity = "info" | "warn" | "critical";

type AuditEvent = {
  type: string;
  severity?: Severity;
  userId?: string | null;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
};

// Non-blocking — never throws, never blocks the request
export function audit(event: AuditEvent) {
  prisma.auditLog.create({
    data: {
      type: event.type,
      severity: event.severity || "info",
      userId: event.userId || null,
      resourceId: event.resourceId || null,
      metadata: event.metadata ? JSON.stringify(event.metadata) : null,
    },
  }).catch(() => {}); // Silent fail — logging never breaks the app
}

export const auditInfo = (type: string, opts?: Omit<AuditEvent, "type" | "severity">) =>
  audit({ type, severity: "info", ...opts });

export const auditWarn = (type: string, opts?: Omit<AuditEvent, "type" | "severity">) =>
  audit({ type, severity: "warn", ...opts });

export const auditCritical = (type: string, opts?: Omit<AuditEvent, "type" | "severity">) =>
  audit({ type, severity: "critical", ...opts });
```

### Key principles:
- **Non-blocking**: Uses fire-and-forget with `.catch(() => {})`. Logging failure never crashes the app.
- **Structured**: Every event has `type`, `severity`, and optional `metadata` (JSON).
- **Categorized**: Three severity levels with different alert thresholds.

## Step 2: Prisma Model

Add to `prisma/schema.prisma`:

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  type       String
  severity   String   @default("info") // info | warn | critical
  userId     String?
  resourceId String?
  metadata   String?  // JSON
  createdAt  DateTime @default(now())

  @@index([type, createdAt])
  @@index([severity, createdAt])
}
```

## Step 3: What to Log

### Severity guide:

| Severity | When to use | Alert? | Examples |
|----------|------------|--------|---------|
| **info** | Normal operations | No | checkout.started, deliver.success, user.signup |
| **warn** | Unexpected but non-breaking | Review daily | deliver.denied, rate.limited, validation.failed |
| **critical** | Security or system failure | Alert immediately | webhook.signature_failed, auth.bypass_attempt, db.connection_lost |

### Event naming convention:
`{domain}.{action}` — e.g., `checkout.started`, `deliver.denied`, `webhook.received`

### Transaction logging pattern:

```typescript
// At the START of a transaction
auditInfo("checkout.started", {
  userId: session.user.id,
  resourceId: skillId,
  metadata: { amount: price },
});

// At the END of a transaction
auditInfo("checkout.completed", {
  userId,
  resourceId: skillId,
  metadata: { amount, sessionId },
});

// On FAILURE
auditWarn("checkout.failed", {
  userId: session.user.id,
  resourceId: skillId,
  metadata: { error: "already_purchased" },
});

// On SECURITY VIOLATION
auditCritical("webhook.signature_failed", {
  metadata: { ip: request.headers.get("x-forwarded-for") },
});
```

## Step 4: Smart Alert Surface

Create `src/app/api/admin/alerts/route.ts`:

```typescript
export async function GET(req: NextRequest) {
  // Admin auth check here

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

  const [total, critical, warn] = await Promise.all([
    prisma.auditLog.count({ where: { createdAt: { gte: since } } }),
    prisma.auditLog.count({ where: { severity: "critical", createdAt: { gte: since } } }),
    prisma.auditLog.count({ where: { severity: "warn", createdAt: { gte: since } } }),
  ]);

  return NextResponse.json({
    summary: { total, critical, warn, period: `${days}d` },
    events,
  });
}
```

### Smart alerting rules:
- **Default view**: Only warn + critical (no noise from info events)
- **`?all=true`**: Full stream when debugging
- **`?days=30`**: Adjustable time window
- **Summary first**: Counts before details — quick triage

## Step 5: Health Check

Create `src/app/api/health/route.ts`:

```typescript
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};

  // Database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  const healthy = Object.values(checks).every((v) => v === "ok");

  return Response.json(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  );
}
```

Use for uptime monitoring: point your monitoring tool at `/api/health`.

## Step 6: Testing Observability

```typescript
import { describe, it, expect } from "vitest";

describe("audit events", () => {
  it("info events don't trigger alerts", () => {
    const severity = "info";
    const isAlert = severity === "warn" || severity === "critical";
    expect(isAlert).toBe(false);
  });

  it("critical events always trigger alerts", () => {
    const severity = "critical";
    const isAlert = severity === "warn" || severity === "critical";
    expect(isAlert).toBe(true);
  });
});
```

## Anti-patterns

- **DON'T** log PII (emails, IPs in info events)
- **DON'T** make logging blocking (`await audit(...)`)
- **DON'T** log every page view (use Vercel Analytics for that)
- **DON'T** set everything to critical (alert fatigue)
- **DO** log every state change (payments, auth, access control)
- **DO** include enough metadata to debug without reproducing
- **DO** test that your severity levels match your alert policy
