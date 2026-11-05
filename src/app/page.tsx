import AllProducts from "@/components/allProducts";
import Hero from "@/components/hero";
import PriceDecrease from "@/components/priceDecrease";
import PriceIncrease from "@/components/priceIncrease";
import Image from "next/image";

export default function Home() {
  const bengaliDate = new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  return (
    <main className="min-h-screen bg-[#f1f6f2]">
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
        <Hero bengaliDate={bengaliDate} />
        <PriceIncrease />
        <PriceDecrease />
        <AllProducts />
    </div>
    </main>
  )
}
