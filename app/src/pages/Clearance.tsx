import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useQuoteCart } from "@/contexts/QuoteCartContext";

const categories = ["clearance_tiles", "clearance_slabs", "clearance_vanities", "clearance_faucets", "contractor_deals", "last_quantity"];

const categoryLabels: Record<string, string> = {
  clearance_tiles: "Clearance Tiles",
  clearance_slabs: "Clearance Slabs",
  clearance_vanities: "Clearance Vanities",
  clearance_faucets: "Clearance Faucets",
  contractor_deals: "Contractor Deals",
  last_quantity: "Last Quantities",
};

export default function Clearance() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const { data, isLoading } = trpc.product.clearance.useQuery(
    activeCategory ? { category: activeCategory } : undefined
  );
  const { addItem } = useQuoteCart();

  const handleAddToQuote = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: Array.isArray(product.images) ? product.images[0] : "/images/collections/swatches.jpg",
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : null,
      quantity: 1,
      sku: product.sku,
      size: product.size,
      colour: product.colour,
      collectionName: null,
    });
  };

  return (
    <div className="bg-ivory min-h-screen">
      <div className="bg-status-trouble/5 pt-24 pb-8">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-status-trouble">Limited Time</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-forest mt-2">
            Clearance &amp; Deals.
          </h1>
          <p className="text-base text-charcoal/70 max-w-lg mt-3">
            Overstock, last quantities, and special buys. When it&apos;s gone, it&apos;s gone.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-16 z-50 bg-ivory border-b border-linen">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(undefined)}
              className={`px-4 py-2 rounded-full text-xs font-medium border-[1.5px] transition-all ${
                !activeCategory ? "bg-status-trouble text-ivory border-status-trouble" : "bg-transparent text-forest border-linen hover:bg-linen"
              }`}
            >
              All Deals
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium border-[1.5px] transition-all ${
                  activeCategory === cat ? "bg-status-trouble text-ivory border-status-trouble" : "bg-transparent text-forest border-linen hover:bg-linen"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-8 pb-32">
        {/* Urgency Banner */}
        <div className="bg-status-waiting/8 rounded-lg p-6 text-center mb-8">
          <p className="text-sm text-forest mb-3">
            Contractor? Get access to exclusive pricing on clearance items.
          </p>
          <Link
            to="/quote"
            className="inline-flex px-6 py-2.5 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors"
          >
            Open a Trade Account
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-bone rounded-lg animate-pulse" />
            ))}
          </div>
        ) : data?.products && data.products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.products.map((product) => {
              const savePercent = product.salePrice
                ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)
                : 0;
              return (
                <div key={product.id} className="group bg-ivory rounded-lg overflow-hidden border border-linen hover:border-status-trouble/30 hover:shadow-card transition-all">
                  <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-bone relative">
                    <img
                      src={Array.isArray(product.images) ? product.images[0] : "/images/collections/swatches.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-status-trouble text-ivory text-[10px] font-medium rounded">
                      Save {savePercent}%
                    </span>
                    {product.stockQuantity && product.stockQuantity <= 10 && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-status-waiting text-ivory text-[10px] font-medium rounded">
                        Only {product.stockQuantity} left
                      </span>
                    )}
                  </Link>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-forest mb-1">
                      <Link to={`/products/${product.slug}`}>{product.name}</Link>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone mb-2">
                      <span>{product.size}</span>
                      <span>·</span>
                      <span className="capitalize">{product.finish}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-status-trouble">${product.salePrice}</span>
                        <span className="text-xs text-stone line-through ml-2">${product.price}</span>
                      </div>
                      <button
                        onClick={() => handleAddToQuote(product)}
                        className="text-xs font-medium text-forest hover:text-forest-600 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                    <p className="text-[10px] text-status-trouble mt-2">Final sale</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-light text-stone">No clearance items right now</h3>
            <p className="text-sm text-stone mt-2">Check back soon for new deals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
