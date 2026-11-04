
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { UserRound, LogOut, LoaderCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [updating, setUpdating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }

    setUpdating(true);

    try {
      const result = await authClient.updateUser({ name });

      if (result.error) {
        throw new Error(result.error.message || "তথ্য আপডেট করা যায়নি");
      }

      toast.success("আপনার তথ্য সফলভাবে আপডেট হয়েছে");
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(
        error instanceof Error ? error.message : "আপডেট করা যায়নি"
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleSignOut() {
    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Sign out failed");
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("সাইন আউট করা যায়নি");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f1f6f2]">
        <LoaderCircle className="h-8 w-8 animate-spin text-emerald-700" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f1f6f2] px-4 text-center">
        <UserRound className="mb-3 h-12 w-12 text-emerald-700" />
        <h1 className="text-xl font-bold text-gray-800">
          আপনার প্রোফাইল দেখতে সাইন ইন করুন
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          প্রোফাইল ব্যবহার করতে আপনার অ্যাকাউন্টে লগইন করতে হবে।
        </p>
        <Link
          href="/signin"
          className="mt-5 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f1f6f2] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            আপনার ব্যক্তিগত তথ্য এখানে দেখুন ও আপডেট করুন।
          </p>
        </div>

        {/* User Information Card */}
        <section className="mb-5 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Profile picture"}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UserRound size={30} />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-gray-800 sm:text-lg">
                {user.name || "ব্যবহারকারী"}
              </h2>
              <p className="truncate text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            {loggingOut ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <LogOut size={15} />
            )}
            {loggingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
          </button>
        </section>

        {/* Update Information Card */}
        <section className="rounded-xl border border-gray-100 bg-white/90 p-5 shadow-sm sm:p-6">
          <h2 className="mb-6 text-lg font-bold text-gray-800">
            তথ্য
          </h2>

          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name || ""}
                placeholder="আপনার নাম লিখুন"
                required
                maxLength={100}
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
