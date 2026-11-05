
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-[#f9fbf9]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:px-6 lg:px-8 sm:text-left">
        <p className="text-xs text-gray-500">
          <Link href="/" className="font-semibold text-emerald-800">
            বাজার দর
          </Link>
          {" "}— প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-xs text-gray-500">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
