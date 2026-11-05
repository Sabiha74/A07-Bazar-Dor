
import Link from "next/link";
import Image from "next/image";

export default function Hero({
  bengaliDate,
}: {
  bengaliDate: string;
}) {
  return (
    <section className="bg-[#f1f6f2] px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-white/80 px-5 py-6 shadow-sm sm:flex-row sm:px-8 sm:py-5">

        {/* Left Content */}
        <div className="w-full flex-1">
          {/* Eyebrow */}
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-700">
  {bengaliDate}
</span>

          {/* Main Heading */}
          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-gray-800 sm:text-3xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* CTA Button */}
          <Link
            href="#সব-পণ্য"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-emerald-800 active:scale-95 sm:text-sm"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        {/* Right Illustration */}
        <Image
  src="/Images/bazar-hero.png"
  alt="Fresh vegetables basket"
  width={220}
  height={160}
  priority
  className="h-auto w-44 object-contain sm:w-52"
/>

      </div>
    </section>
  );
}
