
import { Product } from "@/types/type";

interface ProductCardProps {
  product: Product;
}

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("bn-BD").format(price);
};

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md sm:p-4">

      {/* Product Information */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f1f6f2] text-xl">
          {product.image}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-gray-800">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            {unitNames[product.unit] || product.unit}
          </p>
        </div>
      </div>

      {/* Price Information */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] text-gray-500">
            আজকের দাম
          </p>

          <p className="mt-0.5 text-sm font-extrabold text-gray-800">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"}
          {" "}
          {formatPrice(product.change.pct)}%
        </span>
      </div>
    </div>
  );
}
