import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { MapPin, Phone, MessageCircle, Mail, CheckCircle } from "lucide-react";

export default function Contact() {
  const submitContact = trpc.contact.submit.useMutation();
  const { data: showroom } = trpc.showroom.info.useQuery();
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

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-forest">{showroom?.address}</p>
                  <p className="text-sm text-forest">{showroom?.city}, {showroom?.province} {showroom?.postalCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <a href={`tel:${showroom?.phone}`} className="text-sm text-forest hover:text-forest-600">{showroom?.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-gold shrink-0" />
                <a href={`https://wa.me/${showroom?.whatsapp?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline">
                  Text us on WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <a href={`mailto:${showroom?.email}`} className="text-sm text-forest-400 hover:text-forest">{showroom?.email}</a>
              </div>
            </div>

            <div className="pt-4 border-t border-linen">
              <p className="text-xs text-forest font-medium mb-3">Prefer to call?</p>
              <a href={`tel:${showroom?.phone}`} className="text-sm text-forest-400 hover:text-forest underline">
                {showroom?.phone}
              </a>
            </div>

            <div className="pt-4 border-t border-linen">
              <p className="text-xs text-stone mb-3">Follow us</p>
              <div className="flex gap-2">
                {["Instagram", "Facebook", "Houzz"].map((social) => (
                  <span
                    key={social}
                    className="w-10 h-10 rounded-full border border-linen flex items-center justify-center text-xs text-stone cursor-default"
                  >
                    {social.charAt(0)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
