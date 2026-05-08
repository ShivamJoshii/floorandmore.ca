import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { Search, X } from "lucide-react";

const filters = {
  category: ["tile", "slab", "mosaic", "sink", "faucet", "vanity"],
  room: ["bathroom", "kitchen", "living", "commercial", "outdoor"],
  look: ["marble", "concrete", "stone", "wood", "plain", "luxury", "modern"],
  colour: ["white", "beige", "grey", "black", "gold", "green", "blue"],
  size: ["12x24", "24x24", "24x48", "slab"],
  finish: ["matte", "polished", "textured", "anti_slip"],
  useCase: ["shower_wall", "shower_floor", "floor", "backsplash", "outdoor"],
};

const colourMap: Record<string, string> = {
  white: "#F5F5F0", beige: "#E8DCC8", grey: "#8A8A8A", black: "#2A2A2A",
  gold: "#D4A843", green: "#5A7D5A", blue: "#4A6B8A",
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useQuoteCart();

  const activeFilters = useMemo(() => {
    const f: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "search") f[key] = value;
    });
    return f;
  }, [searchParams]);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || undefined;

  const { data, isLoading } = trpc.product.list.useQuery({
    ...Object.fromEntries(
      Object.entries(activeFilters).map(([k, v]) => [k, v])
    ),
    search: search || undefined,
    page,
    limit: 24,
  });

  const handleFilterToggle = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get(key) === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (search) newParams.set("search", search);
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) newParams.set("search", searchQuery);
    else newParams.delete("search");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

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

  const getStockBadge = (product: any) => {
    if (product.clearance) return { text: `Save ${Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}%`, className: "bg-status-trouble text-ivory" };
    if (product.stockStatus === "in_stock") return { text: "IN STOCK", className: "bg-status-good text-ivory" };
    if (product.stockStatus === "special_order") return { text: "SPECIAL ORDER", className: "bg-status-waiting text-ivory" };
    if (product.stockStatus === "low_stock") return { text: "LOW STOCK", className: "bg-status-waiting text-ivory" };
    return null;
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Page Header */}
      <div className="bg-forest-50 pt-24 pb-8">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Product Catalog</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-forest mt-2 mb-3">
            Find the right surface.
          </h1>
          <p className="text-base text-charcoal/70 max-w-lg">
            Filter by room, style, material, size, and finish. Every product in stock or available for order.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-16 z-50 bg-ivory border-b border-linen">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-11 pl-10 pr-4 border-[1.5px] border-linen rounded-full text-sm focus:border-forest-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, values]) =>
                  values.map((value) => {
                    const isActive = activeFilters[key] === value;
                    return key === "colour" ? (
                      <button
                        key={`${key}-${value}`}
                        onClick={() => handleFilterToggle(key, value)}
                        className={`w-6 h-6 rounded-full border-2 transition-all shrink-0 ${
                          isActive ? "border-forest scale-110" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: colourMap[value] || value }}
                        title={value}
                      />
                    ) : (
                      <button
                        key={`${key}-${value}`}
                        onClick={() => handleFilterToggle(key, value)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border-[1.5px] transition-all whitespace-nowrap ${
                          isActive
                            ? "bg-forest text-ivory border-forest"
                            : "bg-transparent text-forest border-linen hover:bg-linen"
                        }`}
                      >
                        {value.replace(/_/g, " ")}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {Object.entries(activeFilters).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-forest-50 text-forest text-xs rounded-md"
                >
                  {key}: {value.replace(/_/g, " ")}
                  <button onClick={() => handleFilterToggle(key, value)} className="hover:text-forest-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-forest-400 hover:text-forest underline">
                Clear All
              </button>
            </div>
          )}

          <p className="text-xs text-stone mt-3">
            Showing {data?.products?.length || 0} of {data?.total || 0} products
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-8 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-linen">
                <div className="aspect-square bg-bone animate-shimmer" style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, #F6F2EA 25%, #EDE8DD 50%, #F6F2EA 75%)" }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-16 bg-bone rounded animate-shimmer" />
                  <div className="h-4 w-3/4 bg-bone rounded animate-shimmer" />
                  <div className="h-3 w-1/2 bg-bone rounded animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.products && data.products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {data.products.map((product) => {
                const badge = getStockBadge(product);
                return (
                  <div key={product.id} className="group bg-ivory rounded-lg overflow-hidden border border-linen hover:border-forest-200 hover:shadow-card transition-all">
                    <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-bone relative">
                      <img
                        src={Array.isArray(product.images) ? product.images[0] : "/images/collections/swatches.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                      />
                      {badge && (
                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded ${badge.className}`}>
                          {badge.text}
                        </span>
                      )}
                    </Link>
                    <div className="p-4">
                      <span className="text-[10px] text-forest-400 uppercase tracking-wider">{product.sku}</span>
                      <h4 className="text-sm font-medium text-forest mt-1 mb-1">
                        <Link to={`/products/${product.slug}`}>{product.name}</Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone mb-3">
                        <span>{product.size}</span>
                        <span>·</span>
                        <span className="capitalize">{product.finish}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-forest">
                            ${product.salePrice || product.price}
                            {product.category !== "vanity" && product.category !== "sink" && product.category !== "faucet" ? "/sq ft" : ""}
                          </span>
                          {product.salePrice && (
                            <span className="text-xs text-stone line-through ml-2">${product.price}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToQuote(product)}
                          className="text-xs font-medium text-forest hover:text-forest-600 transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="border-t border-linen mt-3 pt-2 flex items-center justify-between">
                        <Link to={`/samples?product=${product.slug}`} className="text-[11px] text-gold hover:underline">
                          Request Sample
                        </Link>
                        <Link to={`/products/${product.slug}`} className="text-[11px] text-forest-400 hover:text-forest">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {data.hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set("page", String(page + 1));
                    setSearchParams(newParams);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-8 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-stone/30 mb-4" />
            <h3 className="text-xl font-light text-stone mb-2">No products match your filters</h3>
            <p className="text-sm text-stone mb-6">Try adjusting your filters or browse all products.</p>
            <button onClick={clearFilters} className="px-6 py-2 bg-forest text-ivory rounded-full text-sm font-medium">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
