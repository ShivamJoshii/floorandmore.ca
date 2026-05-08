import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { Minus, Plus, Trash2, CheckCircle } from "lucide-react";

export default function Quote() {
  const { items, removeItem, updateQuantity, clearCart } = useQuoteCart();
  const createQuote = trpc.quote.create.useMutation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    projectType: "",
    roomSize: "",
    roomSizeUnit: "sq_ft",
    city: "",
    timeline: "",
    customerType: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    await createQuote.mutateAsync({
      ...form,
      products: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.name,
      })),
    });

    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-ivory pt-24">
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-status-good/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-status-good" />
          </div>
          <h1 className="text-2xl font-light text-forest mb-3">Quote request submitted!</h1>
          <p className="text-sm text-charcoal mb-8">
            We&apos;ll be in touch within 1 business day. A confirmation has been sent to your email.
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
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Your Quote</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-forest mt-2">
            Request a quote.
          </h1>
          <p className="text-base text-charcoal/70 max-w-xl mt-3">
            We&apos;ll review your selections, confirm availability, and get back to you within one business day with pricing and lead times.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-10 pb-32">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-light text-stone mb-2">No products in your quote yet.</h3>
            <p className="text-sm text-stone mb-6">Browse products and click &apos;Add to Quote&apos; to get started.</p>
            <Link to="/products" className="px-8 py-3 bg-forest text-ivory rounded-full text-sm font-medium">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[60%_40%] gap-10">
            {/* Product List */}
            <div>
              <h2 className="text-lg font-medium text-forest mb-6">{items.length} Product{items.length !== 1 ? "s" : ""} Selected</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 bg-ivory border border-linen rounded-lg">
                    <Link to={`/products/${item.slug}`} className="shrink-0 w-20 h-20 rounded bg-bone overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-forest truncate">
                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                      </h4>
                      <p className="text-xs text-stone mt-1">{item.sku}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-linen rounded">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 text-forest hover:bg-forest-50">
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 text-forest hover:bg-forest-50">
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-forest">
                          ${(Number(item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 text-status-trouble hover:bg-status-trouble/10 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/products" className="text-sm text-forest-400 hover:text-forest mt-4 inline-block">
                + Add More Products
              </Link>
            </div>

            {/* Quote Form */}
            <div className="bg-bone rounded-xl p-8 h-fit">
              <h2 className="text-xl font-light text-forest mb-6">Tell us about your project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-forest mb-1 block">Full Name *</label>
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                </div>
                <div>
                  <label className="text-xs text-forest mb-1 block">Project Type</label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
                  >
                    <option value="">Select...</option>
                    <option value="bathroom">Bathroom Renovation</option>
                    <option value="kitchen">Kitchen Renovation</option>
                    <option value="flooring">Flooring</option>
                    <option value="commercial">Commercial Project</option>
                    <option value="outdoor">Outdoor Project</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-forest mb-1 block">Room Size</label>
                    <input
                      type="text"
                      value={form.roomSize}
                      onChange={(e) => setForm({ ...form, roomSize: e.target.value })}
                      placeholder="e.g. 120"
                      className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-forest mb-1 block">Unit</label>
                    <select
                      value={form.roomSizeUnit}
                      onChange={(e) => setForm({ ...form, roomSizeUnit: e.target.value })}
                      className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
                    >
                      <option value="sq_ft">sq ft</option>
                      <option value="sq_m">sq m</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-forest mb-1 block">City</label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
                    />
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
                  <label className="text-xs text-forest mb-1 block">Customer Type</label>
                  <div className="flex gap-3">
                    {["homeowner", "contractor", "designer"].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                        <input
                          type="radio"
                          name="customerType"
                          value={type}
                          checked={form.customerType === type}
                          onChange={(e) => setForm({ ...form, customerType: e.target.value })}
                          className="accent-forest"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-forest mb-1 block">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory resize-none"
                    placeholder="Any additional details about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={createQuote.isPending}
                  className="w-full py-3.5 bg-forest text-ivory rounded-full text-base font-medium hover:bg-forest-600 transition-colors disabled:opacity-50"
                >
                  {createQuote.isPending ? "Sending..." : "Submit Quote Request"}
                </button>
                <p className="text-xs text-stone text-center">
                  Your information is kept confidential and used only to respond to your quote request.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
