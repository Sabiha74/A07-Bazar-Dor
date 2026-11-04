
"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import toast from "react-hot-toast";

export default function SignupPage() {
 const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSignup = async (
  e: SyntheticEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (
    !name.trim() ||
    !email.trim() ||
    !password ||
    !confirmPassword
  ) {
    toast.error("সবগুলো ঘর পূরণ করুন।");
    return;
  }

  if (password.length < 8) {
    toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("পাসওয়ার্ড দুটি মিলছে না!");
    return;
  }

  setLoading(true);

  try {
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
      return;
    }

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন।");
    router.push("/signin");
  } catch {
    toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
  } finally {
    setLoading(false);
  }
};

 const handleSocialSignup = async (
  provider: "google" | "github"
) => {
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  } catch {
    toast.error("সাইন আপ ব্যর্থ হয়েছে।");
  }
};

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-8 text-[#26332b] sm:py-10">
      <div className="mx-auto w-full max-w-[430px]">
        {/* Header */}
        <header className="mb-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত তথ্য দেখুন।
          </p>
        </header>

        {/* Signup Card */}
        <section className="rounded-xl border border-[#e1e9e1] bg-white/75 p-5 sm:p-7">
          <form onSubmit={handleSignup} className="space-y-3.5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-[#e2e9e2] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

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
                className="w-full rounded-lg border border-[#e2e9e2] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
                autoComplete="new-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="w-full rounded-lg border border-[#e2e9e2] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="আবার লিখুন"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#e2e9e2] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#07883e] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#067333] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-500">অথবা</span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Social Signup Buttons */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#e2e9e2] px-3 py-2.5 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5 shrink-0"
                aria-label="Google"
                role="img"
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
              onClick={() => handleSocialSignup("github")}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#e2e9e2] px-3 py-2.5 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[20px] shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 2.4 3.17 1.81.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>

              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          {/* Sign In Link */}
          <p className="mt-4 text-center text-sm text-gray-500">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-medium text-[#07883e] hover:underline"
            >
              সাইন ইন করুন
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
