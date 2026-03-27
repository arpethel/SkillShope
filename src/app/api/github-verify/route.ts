import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = rateLimit(`github-verify:${session.user.id}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Check if it's a GitHub URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    return NextResponse.json({
      verified: false,
      reason: "not-github",
      message: "Only GitHub repositories can be verified for ownership.",
    });
  }

  const repoOwner = match[1].toLowerCase();

  // Get the user's GitHub account
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "github" },
    select: { providerAccountId: true },
  });

  if (!account) {
    return NextResponse.json({
      verified: false,
      reason: "no-github-account",
      message: "No GitHub account linked. Sign in with GitHub to verify ownership.",
    });
  }

  const headers: Record<string, string> = {
    "User-Agent": "SkillShope-Verify",
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // Get the user's GitHub username from their account ID
    const userRes = await fetch(
      `https://api.github.com/user/${account.providerAccountId}`,
      { headers }
    );

    if (!userRes.ok) {
      return NextResponse.json({
        verified: false,
        reason: "github-api-error",
        message: "Could not verify GitHub identity. Try again later.",
      });
    }

    const userData = await userRes.json();
    const githubUsername = (userData.login || "").toLowerCase();

    // Direct owner match
    if (githubUsername === repoOwner) {
      // Update stored username if not set
      await prisma.user.update({
        where: { id: session.user.id },
        data: { githubUsername: userData.login },
      });

      return NextResponse.json({
        verified: true,
        githubUsername: userData.login,
        message: "Verified — you own this repository.",
      });
    }

    // Check if user is a collaborator on the repo
    const repo = match[2].replace(/\.git$/, "");
    const collabRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repo}/collaborators/${githubUsername}`,
      { headers }
    );

    if (collabRes.status === 204) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { githubUsername: userData.login },
      });

      return NextResponse.json({
        verified: true,
        githubUsername: userData.login,
        message: "Verified — you are a collaborator on this repository.",
      });
    }

    return NextResponse.json({
      verified: false,
      reason: "not-owner",
      githubUsername: userData.login,
      repoOwner: match[1],
      message: `This repo belongs to ${match[1]}, not ${userData.login}. Listing as community.`,
    });
  } catch {
    return NextResponse.json({
      verified: false,
      reason: "error",
      message: "Verification failed. Try again later.",
    });
  }
}
