
"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/type";
import ProductCard from "./productCard";
import Link from "next/link";

export default function PriceDecrease() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const allProducts: Product[] = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        // Filter products with decreased prices
        const decreasedProducts = allProducts
          .filter((product) => product.change.dir === "down")
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        setProducts(decreasedProducts);
      } catch (error) {
        console.error("Price decrease fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="space-y-4">
      {/* Section Heading */}
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
        <span className="text-emerald-600">▼</span>
        আজ দাম কমেছে
      </h2>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : (
        /* Product Cards */
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {products.map((product) => (
    <Link
      key={product.id}
      href={`/product/${product.slug}?category=${product.category}`}
      className="block"
    >
      <ProductCard product={product} />
    </Link>
  ))}
</div>
      )}

      {!loading && products.length === 0 && (
        <p className="py-5 text-center text-sm text-gray-500">
          আজ কোনো পণ্যের দাম কমেনি।
        </p>
      )}
    </section>
  );
}
