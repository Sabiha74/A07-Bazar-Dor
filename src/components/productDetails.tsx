
import Link from "next/link";
import { Product } from "@/types/type";

interface ProductDetailsProps {
  product: Product;
}

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const markets = product.markets || [];

  // Calculate overall price summary
  const minimumPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : product.today;

  const maximumPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : product.today;

  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (total, market) => total + (market.min + market.max) / 2,
          0
        ) / markets.length
      : product.today;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const changeColor = isUp
    ? "text-red-600"
    : isDown
      ? "text-green-600"
      : "text-gray-500";

  return (
    <main className="min-h-screen bg-[#f1f6f2]">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-700">
            হোম
          </Link>

          <span>›</span>

          <Link
            href={`/category/${product.category}`}
            className="hover:text-emerald-700"
          >
            {product.categoryNameBn}
          </Link>

          <span>›</span>

          <span className="font-medium text-gray-700">
            {product.nameBn}
          </span>
        </div>

        {/* Product Summary */}
        <section className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f1f6f2] text-4xl">
              {product.image}
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-gray-800">
                {product.nameBn}
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{product.categoryIcon} {product.categoryNameBn}</span>
                <span>•</span>
                <span>{unitNames[product.unit] || product.unit}</span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                আজকের বাজারদর ও বাজারভিত্তিক মূল্য তুলনা
              </p>
            </div>
          </div>

          {/* Today's Price */}
          <div className="flex min-w-28 flex-col items-center justify-center rounded-xl bg-[#f1f6f2] px-5 py-3 text-center">
            <p className="text-xs text-gray-500">
              আজকের দাম
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-gray-800">
              {formatPrice(product.today)}
            </h2>

            <p className="text-xs text-gray-500">
              টাকা / {unitNames[product.unit] || product.unit}
            </p>

            <span className={`mt-1 text-xs font-bold ${changeColor}`}>
              {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
              {formatPrice(product.change.pct)}%
            </span>
          </div>

        </section>

        {/* Price Summary */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">

          <h2 className="mb-4 text-base font-bold text-gray-800">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

            {/* Minimum */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfdfb] p-4">
              <p className="text-xs text-gray-500">
                সর্বনিম্ন দাম
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-emerald-600">
                {formatPrice(minimumPrice)} টাকা
              </h3>

              <p className="mt-1 text-[11px] text-gray-500">
                বাজারগুলোর মধ্যে সর্বনিম্ন দাম
              </p>
            </div>

            {/* Maximum */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfdfb] p-4">
              <p className="text-xs text-gray-500">
                সর্বোচ্চ দাম
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-red-500">
                {formatPrice(maximumPrice)} টাকা
              </h3>

              <p className="mt-1 text-[11px] text-gray-500">
                বাজারগুলোর মধ্যে সর্বোচ্চ দাম
              </p>
            </div>

            {/* Average */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfdfb] p-4">
              <p className="text-xs text-gray-500">
                গড় দাম
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-emerald-600">
                {formatPrice(averagePrice)} টাকা
              </h3>

              <p className="mt-1 text-[11px] text-gray-500">
                বাজারগুলোর গড় মূল্য
              </p>
            </div>

          </div>
        </section>

        {/* Market-wise Price */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">

          <h2 className="mb-4 text-base font-bold text-gray-800">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[650px] border-collapse text-left text-xs">

                <thead className="bg-[#f8faf8] text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">
                      বাজার
                    </th>

                    <th className="px-4 py-3 font-semibold">
                      বিভাগ
                    </th>

                    <th className="px-4 py-3 text-right font-semibold">
                      সর্বনিম্ন
                    </th>

                    <th className="px-4 py-3 text-right font-semibold">
                      সর্বোচ্চ
                    </th>

                    <th className="px-4 py-3 text-right font-semibold">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => {
                    const marketAverage =
                      (market.min + market.max) / 2;

                    return (
                      <tr
                        key={`${market.market}-${index}`}
                        className="border-t border-gray-200 even:bg-[#f1f6f2] hover:bg-emerald-50/50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-700">
                          {market.market}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                          {market.division}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                          {formatPrice(market.min)} টাকা
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                          {formatPrice(market.max)} টাকা
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-800">
                          {formatPrice(marketAverage)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          )}

          <p className="mt-3 text-[11px] text-gray-400">
            * বাজারভিত্তিক গড় মূল্য সর্বনিম্ন ও সর্বোচ্চ দামের গড় থেকে হিসাব করা হয়েছে।
          </p>

        </section>

      </div>
    </main>
  );
}
