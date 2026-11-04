
"use client";

import Link from "next/link";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import toast from "react-hot-toast";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async (
    e: SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      // TODO: Connect your BetterAuth email sign-in method here.
      // Example:
      // const result = await authClient.signIn.email({
      //   email,
      //   password,
      // });
      //
      // On success:
      // toast.success("সফলভাবে সাইন ইন হয়েছে!");
      // router.push("/");

      toast.error("BetterAuth এখনো সংযুক্ত করা হয়নি।");
    } catch {
      toast.error("সাইন ইন করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignin = (provider: "google" | "github") => {
    // TODO: Connect BetterAuth social authentication.
    // Example:
    // await authClient.signIn.social({
    //   provider,
    //   callbackURL: "/",
    // });

    toast.error(
      `${provider === "google" ? "Google" : "GitHub"} লগইন চালু করতে BetterAuth সংযুক্ত করুন।`
    );
  };

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f0f5f0] px-4 py-8 text-[#26332b] sm:py-7">
      <div className="w-full max-w-[430px]">
        {/* Header */}
        <header className="mb-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            সাইন ইন
          </h1>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </header>

        {/* Signin Card */}
        <section className="rounded-xl border border-[#e1e9e1] bg-white/75 p-5 sm:p-7">
          <form onSubmit={handleSignin} className="space-y-3.5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium"
              >
                ইমেইল
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#e2e9e2] bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#e2e9e2] bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-500 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#07883e] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#067333] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">অথবা</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialSignin("google")}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#e2e9e2] px-2 py-2.5 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5 shrink-0"
                role="img"
                aria-label="Google"
              >
                <path
                  fill="#4285F4"
                  d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
                />
                <path
                  fill="#34A853"
                  d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
                />
                <path
                  fill="#EA4335"
                  d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
                />
              </svg>

              <span>Google দিয়ে চালিয়ে যান</span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleSocialSignin("github")}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#e2e9e2] px-2 py-2.5 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px] shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.6 5.22-5.08 5.5.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>

              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          {/* Signup Link */}
          <p className="mt-4 text-center text-sm text-gray-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#07883e] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </section>

        {/* Home Link */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 transition hover:text-green-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
