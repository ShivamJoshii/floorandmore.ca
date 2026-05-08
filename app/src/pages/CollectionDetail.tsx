import { useState } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useQuoteCart } from "@/contexts/QuoteCartContext";

const tabs = ["Overview", "Products", "Gallery"];

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: collection } = trpc.collection.bySlug.useQuery({ slug: slug || "" });
  const { data: collectionProducts } = trpc.product.byCollection.useQuery(
    { collectionId: collection?.id || 0 },
    { enabled: !!collection?.id }
  );
  const { addItem } = useQuoteCart();
  const [activeTab, setActiveTab] = useState("Overview");

  if (!collection) {
    return (
      <div className="min-h-screen bg-ivory pt-24 text-center">
        <h1 className="text-2xl font-light text-forest mt-20">Collection not found</h1>
        <Link to="/collections" className="text-forest-400 hover:text-forest underline mt-4 inline-block">
          View all collections
        </Link>
      </div>
    );
  }

  const images = Array.isArray(collection.images) ? collection.images : [];
  const meta = collection.meta ? JSON.parse(typeof collection.meta === "string" ? collection.meta : "{}") : {};

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
      collectionName: collection.name,
    });
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Collection Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={images[0] || "/images/collections/swatches.jpg"}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="mx-auto max-w-[1400px]">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Collection</span>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-ivory mt-2">{collection.name}</h1>
            <p className="text-base text-ivory/80 mt-2 max-w-xl">{collection.shortDescription}</p>
            <p className="text-xs text-ivory/50 mt-2 capitalize">
              {meta.colours?.length || 0} Colours · {meta.sizes?.length || 0} Sizes · Matching {meta.matching?.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Collection Nav */}
      <div className="sticky top-16 z-40 bg-ivory border-b border-linen">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex items-center justify-between">
          <div className="flex gap-8 overflow-x-auto">
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
          <div className="hidden md:flex items-center gap-3">
            <Link to="/samples" className="text-xs text-gold hover:underline">Request Sample</Link>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-10 pb-32">
        {activeTab === "Overview" && (
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-base text-charcoal leading-relaxed mb-10">
              {collection.description}
            </p>

            {/* Colours */}
            {meta.colours && (
              <div className="mb-10">
                <h3 className="text-sm font-medium text-forest mb-4">Available Colours</h3>
                <div className="flex justify-center gap-4">
                  {meta.colours.map((colour: string) => (
                    <div key={colour} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-bone border-2 border-linen mx-auto mb-2 flex items-center justify-center">
                        <span className="text-xs text-stone capitalize">{colour}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {meta.sizes && (
              <div>
                <h3 className="text-sm font-medium text-forest mb-4">Available Sizes</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {meta.sizes.map((size: string) => (
                    <span key={size} className="px-4 py-2 bg-forest-50 text-forest text-sm rounded-full">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 p-8 bg-forest-50 rounded-lg">
              <h3 className="text-xl font-light text-forest mb-2">Fallen for this collection?</h3>
              <p className="text-sm text-charcoal mb-6">
                Order samples, request a quote, or visit our showroom to see it in person.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/samples" className="px-6 py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors">
                  Request Samples
                </Link>
                <Link to="/showroom" className="px-6 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors">
                  Book Showroom Visit
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Products" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(collectionProducts?.products || []).map((product) => (
              <div key={product.id} className="group bg-ivory rounded-lg overflow-hidden border border-linen hover:border-forest-200 hover:shadow-card transition-all">
                <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-bone">
                  <img
                    src={Array.isArray(product.images) ? product.images[0] : "/images/collections/swatches.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />
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
                    <span className="text-sm font-medium text-forest">${product.price}/sq ft</span>
                    <button
                      onClick={() => handleAddToQuote(product)}
                      className="text-xs font-medium text-forest hover:text-forest-600 transition-colors"
                    >
                      + Add to Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Gallery" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden">
                <img src={img} alt={`${collection.name} gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
