import { useState } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { Star, Truck, RotateCcw, BadgeCheck, Heart, ChevronRight } from "lucide-react";

const tabs = ["Overview", "Specifications", "Installation", "Reviews"];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = trpc.product.bySlug.useQuery({ slug: slug || "" });
  const { data: relatedProducts } = trpc.product.list.useQuery(
    { category: product?.category, limit: 4 },
    { enabled: !!product?.category }
  );
  const { addItem } = useQuoteCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory pt-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square bg-bone rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 w-24 bg-bone rounded" />
              <div className="h-8 w-3/4 bg-bone rounded" />
              <div className="h-6 w-32 bg-bone rounded" />
              <div className="h-20 bg-bone rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory pt-24 text-center">
        <h1 className="text-2xl font-light text-forest mt-20">Product not found</h1>
        <Link to="/products" className="text-forest-400 hover:text-forest underline mt-4 inline-block">
          Browse all products
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : ["/images/collections/swatches.jpg"];
  const [mainImage, setMainImage] = useState(images[0]);
  const isOnSale = product.salePrice && Number(product.salePrice) < Number(product.price);
  const savePercent = isOnSale ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100) : 0;

  const handleAddToQuote = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: images[0],
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : null,
      quantity,
      sku: product.sku,
      size: product.size,
      colour: product.colour,
      collectionName: null,
    });
  };

  const specRows = [
    { label: "SKU", value: product.sku },
    { label: "Material", value: product.material },
    { label: "Size", value: product.size },
    { label: "Thickness", value: product.thickness },
    { label: "Finish", value: product.finish },
    { label: "Rectified", value: product.rectified ? "Yes" : "No" },
    { label: "Indoor/Outdoor", value: product.indoorOutdoor },
    { label: "Floor/Wall", value: product.floorWall },
    { label: "Shower Safe", value: product.showerSafe ? "Yes" : "No" },
    { label: "Slip Rating", value: product.slipRating },
    { label: "Frost Resistant", value: product.frostResistant ? "Yes" : "No" },
    { label: "Water Absorption", value: product.waterAbsorption },
    { label: "Country of Origin", value: product.countryOfOrigin },
    { label: "Carton Coverage", value: product.cartonCoverage ? `${product.cartonCoverage} sq ft` : "-" },
    { label: "Pieces per Box", value: product.piecesPerBox },
    { label: "Weight per Box", value: product.weightPerBox ? `${product.weightPerBox} kg` : "-" },
  ];

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-forest-50 pt-20 pb-3">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex items-center gap-2 text-xs text-stone">
            <Link to="/" className="hover:text-forest">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-forest">Products</Link>
            <ChevronRight size={12} />
            <span className="capitalize">{product.category}</span>
            <ChevronRight size={12} />
            <span className="text-charcoal">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Hero */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-10">
        <div className="grid md:grid-cols-[55%_45%] gap-10">
          {/* Left: Image Gallery */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-bone">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                    mainImage === img ? "border-forest" : "border-transparent hover:border-linen"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <Link
              to={`/collections`}
              className="inline-block px-3 py-1 bg-forest-50 text-forest-400 text-xs rounded-full mb-4"
            >
              {product.category === "tile" ? "Tile Collection" : product.category}
            </Link>

            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-forest mb-1">
              {product.name}
            </h1>
            <p className="text-sm text-stone mb-3 capitalize">
              {product.size} · {product.finish} · {product.rectified ? "Rectified" : ""}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(Number(product.rating)) ? "text-gold fill-gold" : "text-linen"}
                  />
                ))}
              </div>
              <span className="text-xs text-forest-400">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-light text-forest">
                  ${isOnSale ? product.salePrice : product.price}
                  {product.category !== "vanity" && product.category !== "sink" && product.category !== "faucet" ? "/sq ft" : ""}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-lg text-stone line-through">${product.price}</span>
                    <span className="px-2 py-0.5 bg-status-trouble/10 text-status-trouble text-xs rounded-full font-medium">
                      Save {savePercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-stone mt-1">
                {product.cartonCoverage ? `~$${(Number(isOnSale ? product.salePrice : product.price) * Number(product.cartonCoverage)).toFixed(2)} per box · ${product.cartonCoverage} sq ft per box` : ""}
              </p>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${product.stockStatus === "in_stock" ? "bg-status-good" : "bg-status-waiting"}`} />
              <span className="text-sm text-charcoal">
                {product.stockStatus === "in_stock" ? `In Stock — ships within 3-5 business days` : "Special Order — 2-3 weeks"}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-forest">Quantity:</span>
              <div className="flex items-center border border-linen rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-forest hover:bg-forest-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-forest hover:bg-forest-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <button
              onClick={handleAddToQuote}
              className="w-full py-4 bg-forest text-ivory rounded-full text-base font-medium hover:bg-forest-600 transition-colors mb-3"
            >
              Add to Quote
            </button>

            <div className="flex gap-3">
              <Link
                to={`/samples?product=${product.slug}`}
                className="flex-1 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium text-center hover:bg-forest-50 transition-colors"
              >
                Request Sample
              </Link>
              <button
                onClick={() => setSaved(!saved)}
                className={`p-3 border-[1.5px] rounded-full transition-colors ${
                  saved ? "border-status-trouble bg-status-trouble/10 text-status-trouble" : "border-linen text-forest hover:bg-forest-50"
                }`}
              >
                <Heart size={18} className={saved ? "fill-status-trouble" : ""} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mt-6 pt-6 border-t border-linen">
              {[
                { icon: Truck, text: "Free Shipping over $500" },
                { icon: RotateCcw, text: "30-Day Returns" },
                { icon: BadgeCheck, text: "Price Match Guarantee" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <badge.icon size={18} className="text-forest-400" />
                  <span className="text-xs text-stone">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="sticky top-16 z-40 bg-ivory border-b border-linen">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab ? "border-forest text-forest" : "border-transparent text-stone hover:text-forest-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-10 pb-32">
        {activeTab === "Overview" && (
          <div className="max-w-3xl">
            <p className="text-base text-charcoal leading-relaxed mb-6">
              {product.description || product.shortDescription}
            </p>
            <h3 className="text-lg font-medium text-forest mb-3">Key Features</h3>
            <ul className="space-y-2 mb-8">
              {[
                product.floorWall && `Suitable for ${product.floorWall} application`,
                product.rectified && "Rectified edges for minimal grout lines",
                "Premium quality from " + (product.countryOfOrigin || "trusted sources"),
                product.showerSafe && "Shower safe and waterproof",
              ].filter(Boolean).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal">
                  <BadgeCheck size={16} className="text-gold shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Related Products */}
            {relatedProducts?.products && relatedProducts.products.length > 0 && (
              <>
                <h3 className="text-lg font-medium text-forest mb-4">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.products.filter(p => p.id !== product.id).slice(0, 4).map((rp) => (
                    <Link key={rp.id} to={`/products/${rp.slug}`} className="group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-bone mb-2">
                        <img
                          src={Array.isArray(rp.images) ? rp.images[0] : "/images/collections/swatches.jpg"}
                          alt={rp.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <p className="text-xs font-medium text-forest">{rp.name}</p>
                      <p className="text-xs text-stone">${rp.price}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "Specifications" && (
          <div className="max-w-2xl">
            <div className="border-t border-linen">
              {specRows.map((row, i) => (
                <div key={i} className="flex items-center py-3 border-b border-linen">
                  <span className="text-xs text-stone w-40 shrink-0">{row.label}</span>
                  <span className="text-sm text-forest">{row.value || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Installation" && (
          <div className="max-w-3xl">
            <p className="text-base text-charcoal leading-relaxed mb-6">
              Professional installation is recommended for best results. Our certified installers ensure proper substrate preparation, leveling, and grouting for a flawless finish.
            </p>
            <div className="bg-forest-50 rounded-lg p-6">
              <h4 className="text-sm font-medium text-forest mb-3">Installation Tips</h4>
              <ul className="space-y-2 text-sm text-charcoal">
                <li className="flex items-start gap-2"><BadgeCheck size={14} className="text-gold mt-1 shrink-0" /> Ensure substrate is clean, level, and dry</li>
                <li className="flex items-start gap-2"><BadgeCheck size={14} className="text-gold mt-1 shrink-0" /> Use appropriate thinset mortar for tile type</li>
                <li className="flex items-start gap-2"><BadgeCheck size={14} className="text-gold mt-1 shrink-0" /> Maintain consistent grout joints</li>
                <li className="flex items-start gap-2"><BadgeCheck size={14} className="text-gold mt-1 shrink-0" /> Seal natural stone tiles before and after grouting</li>
              </ul>
            </div>
            <div className="mt-6">
              <Link to="/services" className="text-sm text-gold hover:underline">
                Book professional installation →
              </Link>
            </div>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-light text-forest">{product.rating}</span>
              <div>
                <div className="flex mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(Number(product.rating)) ? "text-gold fill-gold" : "text-linen"} />
                  ))}
                </div>
                <p className="text-xs text-stone">Based on {product.reviewCount} reviews</p>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { name: "Sarah M.", rating: 5, date: "Feb 2026", text: "Beautiful tile! The quality exceeded our expectations. Installation was straightforward and the finished look is stunning." },
                { name: "David K.", rating: 4, date: "Jan 2026", text: "Great product. Good value for money. The rectified edges make for very clean grout lines. Would recommend." },
              ].map((review, i) => (
                <div key={i} className="border-b border-linen pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-xs font-medium text-forest">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-forest">{review.name}</p>
                      <p className="text-xs text-stone">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < review.rating ? "text-gold fill-gold" : "text-linen"} />
                    ))}
                  </div>
                  <p className="text-sm text-charcoal">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
