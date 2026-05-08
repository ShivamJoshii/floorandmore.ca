import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { CheckCircle } from "lucide-react";

export default function Samples() {
  const [searchParams] = useSearchParams();
  const productSlug = searchParams.get("product");
  const { data: product } = trpc.product.bySlug.useQuery(
    { slug: productSlug || "" },
    { enabled: !!productSlug }
  );
  const createSample = trpc.sample.create.useMutation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    city: "",
    deliveryMethod: "pickup",
    projectType: "",
    timeline: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const products = product
      ? [{ productId: product.id, productName: product.name, sku: product.sku }]
      : [];

    await createSample.mutateAsync({
      ...form,
      products,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-ivory pt-24">
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-status-good/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-status-good" />
          </div>
          <h1 className="text-2xl font-light text-forest mb-3">Sample request submitted!</h1>
          <p className="text-sm text-charcoal mb-8">
            We&apos;ll prepare your samples and notify you when they&apos;re ready for pickup or shipment.
          </p>
          <Link
            to="/products"
            className="px-8 py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors"
          >
            Browse More Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="bg-forest-50 pt-24 pb-8">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Request a Sample</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-forest mt-2">
            See and feel the quality.
          </h1>
          <p className="text-base text-charcoal/70 max-w-xl mt-3">
            Samples are free for trade accounts, or $5 each for homeowners (credited toward your order).
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10 pb-32">
        {/* Selected Product */}
        {product && (
          <div className="flex gap-4 p-4 bg-bone rounded-lg mb-8">
            <div className="shrink-0 w-16 h-16 rounded bg-ivory overflow-hidden">
              <img
                src={Array.isArray(product.images) ? product.images[0] : "/images/collections/swatches.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-forest">{product.name}</h4>
              <p className="text-xs text-stone">{product.sku} · {product.size}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-forest mb-1 block">Full Name *</label>
              <input
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
              />
            </div>
            <div>
              <label className="text-xs text-forest mb-1 block">Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-forest mb-1 block">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
            />
          </div>
          <div>
            <label className="text-xs text-forest mb-1 block">City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
            />
          </div>
          <div>
            <label className="text-xs text-forest mb-1 block">Delivery Method</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-linen rounded-lg cursor-pointer hover:bg-forest-50 transition-colors">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={form.deliveryMethod === "pickup"}
                  onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                  className="accent-forest"
                />
                <div>
                  <p className="text-sm text-forest font-medium">Pickup at Showroom</p>
                  <p className="text-xs text-stone">1500 Dundas Street East, Toronto</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-linen rounded-lg cursor-pointer hover:bg-forest-50 transition-colors">
                <input
                  type="radio"
                  name="delivery"
                  value="delivery"
                  checked={form.deliveryMethod === "delivery"}
                  onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                  className="accent-forest"
                />
                <div>
                  <p className="text-sm text-forest font-medium">Delivery</p>
                  <p className="text-xs text-stone">We&apos;ll ship to your address (shipping fees may apply)</p>
                </div>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-forest mb-1 block">Project Type</label>
              <select
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
              >
                <option value="">Select...</option>
                <option value="bathroom">Bathroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="flooring">Flooring</option>
                <option value="commercial">Commercial</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-forest mb-1 block">Timeline</label>
              <select
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
              >
                <option value="">Select...</option>
                <option value="asap">ASAP</option>
                <option value="1_3_months">1-3 Months</option>
                <option value="3_6_months">3-6 Months</option>
                <option value="planning">Just Planning</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-forest mb-1 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory resize-none"
              placeholder="Any additional notes..."
            />
          </div>
          <button
            type="submit"
            disabled={createSample.isPending}
            className="w-full py-3.5 bg-forest text-ivory rounded-full text-base font-medium hover:bg-forest-600 transition-colors disabled:opacity-50"
          >
            {createSample.isPending ? "Sending..." : "Request Samples"}
          </button>
        </form>
      </div>
    </div>
  );
}
