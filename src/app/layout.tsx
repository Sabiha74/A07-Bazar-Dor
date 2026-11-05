import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Marquee from "@/components/marquee";
const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-geist-sans",
  subsets: ["latin","bengali"],
});


export const metadata: Metadata = {
  title: "বাজার দর",
  description: "বাংলাদেশের পণ্যের বাজার দর জানার সহজ সমাধান",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate the date once on the server
  const bengaliDate = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <html
      lang="bn"
      className={`${notoSerifBengali.className} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Toaster position="top-center" />

        <Navbar bengaliDate={bengaliDate} />
        <Marquee />
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}