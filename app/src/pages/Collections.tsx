import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

export default function Collections() {
  const { data: collections, isLoading } = trpc.collection.list.useQuery();

  return (
    <div className="bg-ivory min-h-screen">
      <div className="bg-forest-50 pt-24 pb-8">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Collections</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-forest mt-2">
            Curated tile collections.
          </h1>
          <p className="text-base text-charcoal/70 max-w-lg mt-3">
            Collections designed to work together — tiles, mosaics, and trim in coordinated colours and finishes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-12 pb-32">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-bone rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(collections || []).map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden"
              >
                <img
                  src={Array.isArray(collection.images) ? collection.images[0] : "/images/collections/swatches.jpg"}
                  alt={collection.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold mb-2 block">
                    Collection
                  </span>
                  <h3 className="text-xl font-light text-ivory mb-1">{collection.name}</h3>
                  <p className="text-sm text-ivory/70 mb-3">{collection.shortDescription}</p>
                  <span className="text-sm text-gold underline underline-offset-4 decoration-transparent group-hover:decoration-gold transition-all">
                    Explore Collection
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
