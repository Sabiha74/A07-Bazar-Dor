
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Product, Category } from "@/types/type";
import ProductCard from "@/components/productCard";

type SortOption = "default" | "low-to-high" | "high-to-low";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategoryData() {
      setLoading(true);
      setError(false);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("Category API URL is missing");
        }

        const [categoryResponse, productResponse] = await Promise.all([
          fetch(`${apiUrl}/categories`),
          fetch(`${apiUrl}/products`),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error("Failed to fetch category data");
        }

        const categoryData = await categoryResponse.json();
        const productData = await productResponse.json();

        const allCategories: Category[] = Array.isArray(categoryData)
          ? categoryData
          : categoryData.categories || categoryData.data || [];

        const allProducts: Product[] = Array.isArray(productData)
          ? productData
          : productData.products || productData.data || [];

        const selectedCategory = allCategories.find(
          (item) => item.slug === slug
        );

        if (!cancelled) {
          if (!selectedCategory) {
            setCategory(null);
            setProducts([]);
            setError(true);
            return;
          }

          const filteredProducts = allProducts.filter(
            (product) => product.category === slug
          );

          setCategory(selectedCategory);
          setProducts(filteredProducts);
        }
      } catch (err) {
        console.error("Category fetching error:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCategoryData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Sorting products by numeric price
  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low-to-high") {
      result.sort((a, b) => a.today - b.today);
    }

    if (sort === "high-to-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  // Invalid category / API error
  if (!loading && (error || !category)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f1f6f2] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            404 - পণ্য পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            দুঃখিত! এই ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।
          </p>

          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f6f2]">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">

        {/* Category Header */}
        <section className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f1f6f2] text-3xl">
            {category?.icon}
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-gray-800">
              {category?.nameBn}
            </h1>

            <p className="text-xs text-gray-500">
              {products.length}টি পণ্যের বাজারদর ও পরিবর্তন
            </p>
          </div>
        </section>

        {/* Sorting */}
        <section className="flex items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <label
            htmlFor="product-sort"
            className="text-xs text-gray-500"
          >
            সাজান:
          </label>

          <select
            id="product-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-emerald-500"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </section>

        {/* Product Count */}
        <p className="text-xs text-gray-500">
          মোট {products.length}টি পণ্য পাওয়া গেছে
        </p>

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
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="block"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white py-10 text-center">
            <p className="text-sm text-gray-500">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
