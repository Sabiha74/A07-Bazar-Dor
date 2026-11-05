
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/type";
import ProductCard from "./productCard";

export default function AllProducts() {
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
          : Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.data)
              ? data.data
              : [];

        setProducts(allProducts);
      } catch (error) {
        console.error("All products fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="সব-পণ্য" className="space-y-4">

      {/* Section Heading */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          সব পণ্য
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          মোট {loading ? "..." : products.length}টি পণ্য দেখানো হচ্ছে।
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : products.length > 0 ? (

        /* All Product Cards */
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

      ) : (

        /* Empty State */
        <div className="rounded-xl border border-gray-200 bg-white py-10 text-center">
          <p className="text-sm font-medium text-gray-600">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        </div>
      )}

    </section>
  );
}
