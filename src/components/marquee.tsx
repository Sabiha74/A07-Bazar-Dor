"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/type";

const unitNames: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
};

export default function Marquee() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Marquee data fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

 if (loading) {
  return (
    <div className="h-9 w-full animate-pulse border-y border-gray-100 bg-gray-50" />
  );
}

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden border-y border-gray-200 bg-white">
      <div className="marquee-track flex w-max">
        {[0, 1].map((group) => (
          <div
            key={group}
            className="flex shrink-0 items-center"
            aria-hidden={group === 1}
          >
            {products.map((product) => {
              const isUp = product.change.dir === "up";
              const isDown = product.change.dir === "down";

              return (
                <div
                  key={`${group}-${product.id}`}
                  className="flex shrink-0 items-center gap-1.5 border-r border-gray-200 px-4 py-2 text-xs"
                >
                  <span>{product.image}</span>

                  <span className="whitespace-nowrap font-medium text-gray-700">
                    {product.nameBn}
                  </span>

                  <span className="whitespace-nowrap text-gray-600">
                    {formatNumber(product.today)} টাকা/
                    {unitNames[product.unit] || product.unit}
                  </span>

                  <span
                    className={`whitespace-nowrap font-semibold ${
                      isUp
                        ? "text-red-500"
                        : isDown
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {isUp ? "▲" : isDown ? "▼" : "—"}
                    {formatNumber(product.change.pct)}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 120s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}