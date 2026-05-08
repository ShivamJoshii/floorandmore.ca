import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { ArrowRight, MapPin, Users, Truck, BadgeCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const heroImages = [
  "/images/hero/hallway.jpg",
  "/images/hero/kitchen.jpg",
  "/images/hero/bathroom.jpg",
  "/images/hero/terrace.jpg",
];

const rooms = [
  { name: "Bathroom", desc: "Steam showers, wet rooms, vanities", image: "/images/rooms/bathroom.jpg", slug: "bathroom" },
  { name: "Kitchen", desc: "Backsplashes, floors, islands", image: "/images/rooms/kitchen.jpg", slug: "kitchen" },
  { name: "Living Spaces", desc: "Feature walls, fireplaces, flooring", image: "/images/rooms/living.jpg", slug: "living" },
  { name: "Commercial", desc: "Offices, retail, hospitality", image: "/images/rooms/commercial.jpg", slug: "commercial" },
  { name: "Outdoor", desc: "Patios, pool decks, facades", image: "/images/rooms/outdoor.jpg", slug: "outdoor" },
];

const values = [
  { icon: MapPin, title: "Local Showroom", desc: "Visit our showroom to see, touch, and compare hundreds of products in person." },
  { icon: Users, title: "Expert Guidance", desc: "Our team helps you choose the right products for your project and budget." },
  { icon: Truck, title: "Delivery Across Canada", desc: "From Toronto to Vancouver, we deliver to your door or job site." },
  { icon: BadgeCheck, title: "Trade Pricing", desc: "Contractors and designers get exclusive pricing and dedicated support." },
];

export default function Home() {
  const { data: featuredProducts } = trpc.product.featured.useQuery();
  const { data: featuredCollections } = trpc.collection.list.useQuery({ featured: true });
  const { data: featuredProjects } = trpc.project.featured.useQuery();
  const { addItem } = useQuoteCart();

  const heroRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const wrapper = heroRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const imageScale = 1 + 0.2 * (1 - progress);

          if (imageRefs.current[0]) {
            imageRefs.current[0].style.transform = `scale(${imageScale})`;
          }

          // Image bands
          for (let i = 1; i <= 3; i++) {
            const img = imageRefs.current[i];
            if (!img) continue;
            const start = i * 0.25;
            const innerProgress = Math.min(Math.max((progress - start) / 0.25, 0), 1);
            img.style.opacity = String(innerProgress);
            img.style.transform = `scale(${1 + 0.2 * (1 - innerProgress)})`;
          }
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        gsap.fromTo(
          section.querySelectorAll("[data-animate]"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [featuredProducts, featuredCollections, featuredProjects]);

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
    <div className="bg-ivory">
      {/* Hero Section - Split Canvas Scroll */}
      <div ref={heroRef} className="relative w-full" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex flex-col md:flex-row overflow-hidden">
          {/* Left: Image Sequence */}
          <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden">
            {heroImages.map((src, i) => (
              <img
                key={src}
                ref={(el) => { imageRefs.current[i] = el; }}
                src={src}
                alt=""
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ opacity: i === 0 ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          {/* Right: Content Panels */}
          <div className="w-full md:w-1/2 h-auto md:h-full flex flex-col bg-ivory">
            {/* Panel 1 - Primary Hook */}
            <div className="h-auto md:h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-0">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold mb-4">
                Premium Tiles, Slabs &amp; Fixtures
              </span>
              <div className="w-12 h-[1px] bg-gold mb-6" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] tracking-tight text-forest mb-6">
                Surfaces that define a room.
              </h1>
              <p className="text-base md:text-lg text-charcoal/80 leading-relaxed max-w-md mb-8">
                For homeowners, builders, and designers who care about every detail.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="px-7 py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors"
                >
                  Shop Products
                </Link>
                <Link
                  to="/showroom"
                  className="px-7 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors"
                >
                  Visit Showroom
                </Link>
              </div>
            </div>

            {/* Panel 2 - For the Trade */}
            <div className="h-auto md:h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-0">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold mb-4">
                Contractors &amp; Designers
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight text-forest mb-6">
                Trade pricing. Fast quotes. Real stock.
              </h2>
              <p className="text-base text-charcoal/80 leading-relaxed max-w-md mb-8">
                Get same-day quotes, project coordination, and contractor pricing. We understand timelines and deliverables.
              </p>
              <Link
                to="/quote"
                className="inline-flex px-7 py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors w-fit"
              >
                Open a Trade Account
              </Link>
            </div>

            {/* Panel 3 - Services */}
            <div className="h-auto md:h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-0">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold mb-4">
                Renovations &amp; Installation
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight text-forest mb-6">
                From selection to installation.
              </h2>
              <p className="text-base text-charcoal/80 leading-relaxed max-w-md mb-8">
                Full-service renovation for bathrooms, kitchens, and flooring. Our team handles demo, prep, and precision installation.
              </p>
              <Link
                to="/work"
                className="inline-flex px-7 py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors w-fit"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Shop by Room */}
      <section
        ref={(el) => { if (el) sectionsRef.current[0] = el; }}
        className="py-20 md:py-28 bg-ivory"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Browse by Room</span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-forest mt-2" data-animate>
                Find tiles for your space.
              </h2>
            </div>
            <p className="text-sm text-charcoal/70 max-w-md mt-3 md:mt-0" data-animate>
              From powder rooms to hotel lobbies — we have the right surface for every environment.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {rooms.map((room) => (
              <Link
                key={room.slug}
                to={`/products?room=${room.slug}`}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden"
                data-animate
              >
                <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/75 via-forest/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-lg font-light text-ivory mb-1">{room.name}</h3>
                  <span className="text-xs text-gold flex items-center gap-1">
                    View products <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section
        ref={(el) => { if (el) sectionsRef.current[1] = el; }}
        className="py-20 md:py-28 bg-ivory"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Curated Collections</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-forest mt-2 mb-10" data-animate>
            Collections that work together.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {(featuredCollections || []).slice(0, 2).map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="group relative aspect-[16/10] rounded-lg overflow-hidden"
                data-animate
              >
                <img
                  src={Array.isArray(collection.images) ? collection.images[0] : "/images/collections/swatches.jpg"}
                  alt={collection.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-light text-ivory mb-1">{collection.name}</h3>
                  <p className="text-sm text-ivory/70 mb-3">{collection.shortDescription}</p>
                  <span className="text-sm text-gold underline underline-offset-4 decoration-transparent group-hover:decoration-gold transition-all">
                    Explore Collection
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/collections" className="text-sm text-forest-400 hover:text-forest font-medium underline underline-offset-4">
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        ref={(el) => { if (el) sectionsRef.current[2] = el; }}
        className="py-20 md:py-28 bg-forest-50"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Featured Products</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-forest mt-2 mb-10" data-animate>
            Customer favourites.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(featuredProducts || []).slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="group bg-ivory rounded-lg overflow-hidden border border-linen hover:border-forest-200 hover:shadow-card transition-all"
                data-animate
              >
                <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-bone">
                  <img
                    src={Array.isArray(product.images) ? product.images[0] : "/images/collections/swatches.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />
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
                    <span className="text-sm font-medium text-forest">
                      ${product.price}
                      {product.category !== "vanity" && product.category !== "sink" && product.category !== "faucet"
                        ? "/sq ft" : ""
                      }
                    </span>
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

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex px-8 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Floor and More */}
      <section
        ref={(el) => { if (el) sectionsRef.current[3] = el; }}
        className="py-20 md:py-28 bg-ivory"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden" data-animate>
              <img
                src="/images/collections/why-choose-us.jpg"
                alt="Beautifully tiled bathroom"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-forest mt-2 mb-8" data-animate>
                More than a supplier. A partner.
              </h2>
              <div className="space-y-6">
                {values.map((value) => (
                  <div key={value.title} className="flex gap-4" data-animate>
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-forest-50 flex items-center justify-center">
                      <value.icon size={20} className="text-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forest">{value.title}</h4>
                      <p className="text-sm text-stone leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section
        ref={(el) => { if (el) sectionsRef.current[4] = el; }}
        className="py-20 md:py-28 bg-forest"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-ivory mt-2 mb-4" data-animate>
            Full-service renovation &amp; installation.
          </h2>
          <p className="text-base text-ivory/70 max-w-2xl mb-12" data-animate>
            From demolition to final grout line, our certified installers deliver precision work on bathrooms, kitchens, flooring, and commercial spaces.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Bathroom Renovations", desc: "Full gut-to-finish bathroom renovations. Waterproofing, tiling, fixture installation, and finishing.", icon: "bath" },
              { name: "Kitchen Tiling", desc: "Backsplashes, flooring, island cladding. Precision cuts around outlets, appliances, and corners.", icon: "chef" },
              { name: "Flooring & Commercial", desc: "Large-format flooring, commercial-grade installation, rapid turnaround for business clients.", icon: "building" },
            ].map((service) => (
              <div
                key={service.name}
                className="bg-ivory/[0.06] border border-ivory/10 rounded-lg p-8 md:p-10"
                data-animate
              >
                <h3 className="text-lg font-light text-ivory mb-3">{service.name}</h3>
                <p className="text-sm text-ivory/70 leading-relaxed mb-4">{service.desc}</p>
                <Link to="/services" className="text-sm text-gold hover:underline underline-offset-4">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Work */}
      <section
        ref={(el) => { if (el) sectionsRef.current[5] = el; }}
        className="py-20 md:py-28 bg-ivory"
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Our Work</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-forest mt-2 mb-10" data-animate>
            Projects we&apos;re proud of.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(featuredProjects || []).slice(0, 4).map((project) => (
              <Link
                key={project.id}
                to="/work"
                className="group relative aspect-[4/3] rounded-lg overflow-hidden"
                data-animate
              >
                <img
                  src={Array.isArray(project.images) ? project.images[0] : "/images/projects/project1.jpg"}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/50 transition-colors flex items-center justify-center">
                  <span className="text-sm font-light text-ivory opacity-0 group-hover:opacity-100 transition-opacity text-center px-4">
                    {project.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/work"
              className="inline-flex px-8 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="py-20 md:py-24 bg-gold-100">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-forest mb-4" data-animate>
            Ready to start your project?
          </h2>
          <p className="text-base text-charcoal/80 max-w-xl mx-auto mb-8" data-animate>
            Tell us what you&apos;re working on. We&apos;ll recommend products, estimate quantities, and get you pricing within one business day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-animate>
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest text-ivory rounded-full text-base font-medium hover:bg-forest-600 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
              </span>
              Get a Free Quote
            </Link>
            <a href="tel:+14165550147" className="text-sm text-forest-400 hover:text-forest underline underline-offset-4">
              Or call us: (416) 555-0147
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
