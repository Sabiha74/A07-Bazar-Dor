
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  ShoppingBasket,
  Loader2,
} from "lucide-react";

import type { Product } from "@/types/type";

// API URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

// Unit labels
const unitLabels: Record<Product["unit"], string> = {
  kg: "কেজি",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "টি",
};

// Convert English numbers to Bengali numbers
function bn(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

// Extract products from API response
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getProducts(result: unknown): Product[] {
  if (Array.isArray(result)) {
    return result as Product[];
  }

  if (!isRecord(result)) {
    return [];
  }

  const data = result.data;
  const products = result.products;

  if (Array.isArray(data)) {
    return data as Product[];
  }

  if (Array.isArray(products)) {
    return products as Product[];
  }

  if (isRecord(data) && Array.isArray(data.products)) {
    return data.products as Product[];
  }

  return [];
}

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product data
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        }

        const result = await response.json();
        const products = getProducts(result);

        const foundProduct = products.find(
          (item) => item.slug === slug
        );

        if (!foundProduct) {
          setError("পণ্যটি খুঁজে পাওয়া যায়নি।");
          return;
        }
       
        setProduct(foundProduct);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("পণ্যের তথ্য লোড করতে সমস্যা হয়েছে।");
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-700">
          <Loader2 className="animate-spin" size={24} />
          <span>পণ্যের তথ্য লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingBasket size={42} className="text-gray-400" />

        <h2 className="text-xl font-bold text-gray-800">
          {error || "পণ্য পাওয়া যায়নি"}
        </h2>

        <Link
          href="/"
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  // Product information
  const unit = unitLabels[product.unit] ?? product.unit;
  const markets = product.markets ?? [];

  // Price change color
  const changeColor =
    product.change.dir === "up"
      ? "text-red-500"
      : product.change.dir === "down"
        ? "text-emerald-600"
        : "text-gray-500";

  // Price change icon
  const ChangeIcon =
    product.change.dir === "up"
      ? TrendingUp
      : product.change.dir === "down"
        ? TrendingDown
        : Minus;

  // Minimum price
  const minPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : product.today;

  // Maximum price
  const maxPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : product.today;

  // Average price
  const averagePrice = markets.length
    ? Math.round(
        markets.reduce(
          (total, market) =>
            total + (market.min + market.max) / 2,
          0
        ) / markets.length
      )
    : product.today;

  return (
    <main className="min-h-screen bg-[#f0f5f1]">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">

        {/* =================================
            PRODUCT INFORMATION
        ================================= */}
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:p-5">

          {/* Product Image and Details */}
          <div className="flex min-w-0 items-center gap-4">

            {/* Product Image from API */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f5f1] sm:h-28 sm:w-28">
  <span className="text-5xl">
    {product.image || product.categoryIcon || "🛒"}
  </span>
</div>

            {/* Product Name and Category */}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {product.categoryNameBn} · প্রতি {unit}
              </p>

              <p className="mt-2 text-sm text-gray-500">
  গতকালের তুলনায় আজকের দাম{" "}
  <span
    className={`font-semibold ${
      product.today > product.yesterday
        ? "text-red-500"
        : product.today < product.yesterday
        ? "text-green-600"
        : "text-gray-500"
    }`}
  >
    {product.today > product.yesterday
      ? `${bn(product.today - product.yesterday)} টাকা বেড়েছে`
      : product.today < product.yesterday
      ? `${bn(product.yesterday - product.today)} টাকা কমেছে`
      : "অপরিবর্তিত"}
  </span>
</p>
            </div>
          </div>

          {/* Today's Price and Change */}
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">

            {/* Today's Price */}
            <div className="flex min-w-[120px] flex-col items-center justify-center rounded-xl bg-[#edf5ed] px-5 py-4">
              <p className="text-xs font-medium text-gray-500">
                আজকের দাম
              </p>

              <p className="mt-1 text-2xl font-extrabold text-green-700">
                ৳{bn(product.today)}
              </p>

              <p className="text-xs text-gray-500">
                প্রতি {unit}
              </p>
            </div>

            {/* Price Change Percentage */}
            <div
              className={`flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-bold ${changeColor}`}
            >
              <ChangeIcon size={16} />
              {bn(product.change.pct)}%
            </div>
          </div>
        </section>

        {/* =================================
            PRICE SUMMARY
        ================================= */}
        <section className="rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 sm:p-5">

          <h2 className="mb-4 text-base font-bold text-[#26352b]">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

            {/* Minimum Price */}
            <div className="rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-4">
              <p className="text-xs font-medium text-gray-600">
                সর্বনিম্ন দাম
              </p>

              <p className="mt-2 text-xl font-extrabold text-emerald-600">
                {bn(minPrice)}{" "}
                <span className="text-xs font-medium">
                  টাকা
                </span>
              </p>

              <p className="mt-1 text-[11px] text-gray-500">
                সবচেয়ে কম দামের বাজার
              </p>
            </div>

            {/* Maximum Price */}
            <div className="rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-4">
              <p className="text-xs font-medium text-gray-600">
                সর্বোচ্চ দাম
              </p>

              <p className="mt-2 text-xl font-extrabold text-red-500">
                {bn(maxPrice)}{" "}
                <span className="text-xs font-medium">
                  টাকা
                </span>
              </p>

              <p className="mt-1 text-[11px] text-gray-500">
                সবচেয়ে বেশি দামের বাজার
              </p>
            </div>

            {/* Average Price */}
            <div className="rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-4">
              <p className="text-xs font-medium text-gray-600">
                গড় দাম
              </p>

              <p className="mt-2 text-xl font-extrabold text-emerald-600">
                {bn(averagePrice)}{" "}
                <span className="text-xs font-medium">
                  টাকা
                </span>
              </p>

              <p className="mt-1 text-[11px] text-gray-500">
                প্রতি {unit}-এর হিসাবে
              </p>
            </div>

          </div>
        </section>

        {/* =================================
            MARKET-WISE PRICE
        ================================= */}
        <section className="rounded-2xl border border-[#e1e9e2] bg-[#fbfdfb] p-4 sm:p-5">

          <div className="mb-4">
            <h2 className="text-base font-bold text-[#26352b]">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              বিভিন্ন বাজারে এই পণ্যের বর্তমান দাম
            </p>
          </div>

          {markets.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-[#e1e9e2]">

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">

                  <thead className="bg-[#f7faf7] text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        বাজার
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        বিভাগ
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        সর্বনিম্ন
                      </th>

                      <th className="px-5 py-4 text-right font-semibold">
                        সর্বোচ্চ
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#e1e9e2]">
                    {markets.map((market, index) => (
                      <tr
                        key={`${market.market}-${index}`}
                        className="transition-colors odd:bg-white even:bg-[#f7faf7] hover:bg-emerald-50"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                          {market.market}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                          {market.division}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right text-gray-700">
                          {bn(market.min)} টাকা
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-gray-800">
                          {bn(market.max)} টাকা
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#f7faf7] px-4 py-8 text-center text-sm text-gray-500">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
