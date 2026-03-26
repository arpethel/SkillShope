"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Plus, LayoutDashboard, User, ShieldCheck, Sparkles, Menu, X } from "lucide-react";
import { useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { openHappie } from "@/lib/happie-state";

type NavbarProps = {
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
  isAdmin?: boolean;
  signOutButton?: ReactNode;
};

export function Navbar({ user, isAdmin, signOutButton }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/browse?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Skill Shope" width={32} height={32} />
        </Link>

        {pathname === "/" && (
          <div className="hidden sm:flex flex-1 max-w-md items-center gap-2">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-2 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </form>
            <button
              type="button"
              onClick={() => {
                if (search.trim()) {
                  openHappie(search);
                  setSearch("");
                } else {
                  openHappie("");
                }
              }}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 text-xs text-[var(--text-secondary)] hover:border-[var(--accent)]/40 hover:text-[var(--text)] transition-colors"
              title="Ask Happie (⌘K)"
            >
              <Image src="/logo.png" alt="Happie" width={16} height={16} />
              <span className="hidden lg:inline">Happie</span>
            </button>
          </div>
        )}

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/browse" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Browse</Link>
          <Link href="/bundles" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Bundles</Link>
          <Link href="/docs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Docs</Link>
          <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">About</Link>

          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Dashboard</Link>
              <Link href="/publish" className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors">
                <Plus className="h-4 w-4" />Publish
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] hover:ring-2 hover:ring-[var(--accent)]/40 transition-all overflow-hidden"
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name || ""} className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-4 w-4 text-[var(--accent)]" />
                  )}
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5 shadow-xl">
                      <div className="px-3 py-2 text-sm"><p className="font-medium">{user.name || "User"}</p></div>
                      <div className="my-1 border-t border-[var(--border)]" />
                      <Link href="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)] transition-colors"><User className="h-4 w-4" />Profile</Link>
                      <Link href="/dashboard" onClick={() => setShowMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)] transition-colors"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
                      {isAdmin && (<Link href="/admin" onClick={() => setShowMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)] transition-colors"><ShieldCheck className="h-4 w-4" />Admin</Link>)}
                      <div className="my-1 border-t border-[var(--border)]" />
                      {signOutButton}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link href="/auth/signin" className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors">Sign In</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileNav(!mobileNav)}
          className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile nav overlay */}
        {mobileNav && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileNav(false)} />
            <div className="fixed right-0 top-16 z-50 w-64 border-l border-[var(--border)] bg-[var(--bg)] p-4 md:hidden" style={{ height: "calc(100dvh - 4rem)" }}>
              <nav className="space-y-1">
                {[
                  { href: "/browse", label: "Browse" },
                  { href: "/bundles", label: "Bundles" },
                  { href: "/docs", label: "Docs" },
                  { href: "/about", label: "About" },
                  ...(user ? [
                    { href: "/dashboard", label: "Dashboard" },
                    { href: "/publish", label: "Publish" },
                    { href: "/profile", label: "Profile" },
                    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
                  ] : []),
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNav(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-[var(--accent-soft)] text-[var(--text)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileNav(false)}
                    className="mt-2 block rounded-lg bg-[var(--accent)] px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Sign In
                  </Link>
                )}
                {user && (
                  <div className="mt-2 border-t border-[var(--border)] pt-2">
                    {signOutButton}
                  </div>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
