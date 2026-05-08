import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Clock, CheckCircle } from "lucide-react";

export default function Contact() {
  const submitContact = trpc.contact.submit.useMutation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact.mutateAsync(form);
    setSubmitted(true);
  };

  const subjects = ["General Inquiry", "Quote Request", "Sample Request", "Showroom Visit", "Trade Account", "Careers"];

  return (
    <div className="bg-ivory min-h-screen">
      <div className="bg-forest-50 pt-24 pb-8">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-forest">
            Get in Touch.
          </h1>
          <p className="text-base text-charcoal/70 max-w-lg mt-3">
            Whether you&apos;re ready to buy, planning ahead, or just have questions — we&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-10 pb-32">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-bone rounded-xl p-8">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={40} className="mx-auto text-status-good mb-4" />
                <h3 className="text-lg font-medium text-forest">Message sent!</h3>
                <p className="text-sm text-stone mt-2">We&apos;ll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-forest mb-1 block">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-forest mb-1 block">Phone</label>
                    <input
                      type="tel"
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
                  <label className="text-xs text-forest mb-1 block">Subject *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full h-11 px-3 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory"
                  >
                    <option value="">Select...</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-forest mb-1 block">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border-[1.5px] border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none transition-colors bg-ivory resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="w-full py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors disabled:opacity-50"
                >
                  {submitContact.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info — Coming Soon */}
          <div className="bg-forest-50 border border-linen rounded-xl p-8 flex flex-col justify-center items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ivory">
              <Clock size={20} className="text-gold" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Coming soon</span>
            <h3 className="text-2xl font-light tracking-tight text-forest">
              Address, phone, and email coming soon.
            </h3>
            <p className="text-sm text-stone leading-relaxed">
              We're finalizing our showroom details and contact channels. For now, please use the form on the
              left and we'll get back to you within one business day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
