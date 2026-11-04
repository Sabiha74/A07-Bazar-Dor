
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        
        const response = await fetch("https://openapi.programming-hero.com/api/bazardor/categories");

        if (!response.ok) {
          throw new Error("Could not load categories");
        }

        const result = await response.json();

        const items = Array.isArray(result)
          ? result
          : result.categories ?? result.data ?? [];

        if (!cancelled) {
          setCategories(items);
        }
      } catch (error) {
        console.error("Category loading failed:", error);
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Sign out failed");
      }

      setProfileOpen(false);
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const user = session?.user;

  function categoryHref(slug: string) {
    return `/category/${slug}`;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <div className="flex h-[76px] items-center justify-between gap-4">
          {/* Logo and brand */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="বাজার দর হোম"
          >
            <Image
              src="/images/logo-icon.png"
              alt="বাজার দর লোগো"
              width={48}
              height={48}
              priority
              className="h-11 w-11 rounded-xl object-contain bg-green-300 p-1"
            />

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-emerald-950 sm:text-xl">
                বাজার দর
              </h1>
              <p className="text-[10px] font-medium text-gray-500 sm:text-xs">
                সঠিক দামে, সঠিক বাজার
              </p>
            </div>
          </Link>

          {/* Desktop authentication */}
          <div className="hidden items-center gap-2 sm:flex">
            {isPending ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-emerald-600" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={30}
                      height={30}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <UserRound size={16} />
                    </span>
                  )}

                  <span className="max-w-28 truncate text-sm font-semibold text-gray-700">
                    {user.name || "আমার অ্যাকাউন্ট"}
                  </span>

                  <ChevronDown size={15} />
                </button>

                
{profileOpen && (
  <div className="absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)]">

    {/* User Information */}
    <div className="border-b border-gray-100 px-4 py-3">
      <p className="truncate text-sm font-bold text-gray-800">
        {user.name || "User"}
      </p>

      <p className="mt-0.5 truncate text-xs text-gray-500">
        {user.email}
      </p>
    </div>

    {/* Profile Link */}
    <div className="p-2">
      <Link
        href="/profile"
        onClick={() => setProfileOpen(false)}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
      >
        <UserRound size={17} />
        <span>আমার প্রোফাইল</span>
      </Link>

      {/* Sign Out */}
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loggingOut}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
      >
        <LogOut size={17} />
        <span>
          {loggingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
        </span>
      </button>
    </div>
  </div>
)}

              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-emerald-50 sm:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop category navigation */}
        <nav
          aria-label="Product categories"
          className="hidden items-center gap-1 overflow-x-auto border-t border-gray-100 py-2 sm:flex"
        >
          <Link
            href="/"
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              pathname === "/"
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
            }`}
          >
            🏠 হোম
          </Link>

          {categories.map((category) => {
            const href = categoryHref(category.slug);
            const active =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={category.id}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.nameBn}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-gray-100 py-3 sm:hidden">
            <nav aria-label="Mobile product categories" className="grid gap-1">
              <Link
                href="/"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50"
              >
                🏠 হোম
              </Link>

              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={categoryHref(category.slug)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    pathname === categoryHref(category.slug)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-emerald-50"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.nameBn}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
              {isPending ? (
                <LoaderCircle className="h-5 w-5 animate-spin text-emerald-600" />
              ) : user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {loggingOut ? "Signing out..." : "Sign Out"}
                </button>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="flex-1 rounded-lg border border-emerald-600 px-3 py-2.5 text-center text-sm font-semibold text-emerald-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 rounded-lg bg-emerald-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
