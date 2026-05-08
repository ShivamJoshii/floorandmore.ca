import { Link } from "react-router";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";

const productLinks = [
  { label: "Tile", href: "/products" },
  { label: "Slabs", href: "/products?category=slab" },
  { label: "Vinyl & Flooring", href: "/products?category=tile" },
  { label: "Sinks", href: "/products?category=sink" },
  { label: "Faucets", href: "/products?category=faucet" },
  { label: "Vanities", href: "/products?category=vanity" },
  { label: "Clearance", href: "/clearance" },
];

const companyLinks = [
  { label: "About Us", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Showroom", href: "/showroom" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            {/* Logo — replace this svg block with <img src="/images/logo.svg" /> once the real logo is added */}
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-ivory">
                <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="2" />
                <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="2" />
                <rect x="4" y="4" width="12" height="12" fill="currentColor" opacity="0.15" />
              </svg>
              <span className="text-sm font-medium">Floor and More</span>
            </Link>
            <p className="text-sm text-ivory/60 leading-relaxed mb-4">
              Premium tiles, slabs, and renovation services.
            </p>
            <p className="text-xs text-ivory/40">Showroom address coming soon</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-medium text-gold uppercase tracking-[0.08em] mb-4">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-xs text-ivory/60 hover:text-ivory transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium text-gold uppercase tracking-[0.08em] mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-ivory/60 hover:text-ivory transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-medium text-gold uppercase tracking-[0.08em] mb-4">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs text-ivory/40">
                <Phone size={14} className="text-gold" /> Phone — coming soon
              </li>
              <li className="flex items-center gap-2 text-xs text-ivory/40">
                <Mail size={14} className="text-gold" /> Email — coming soon
              </li>
              <li className="flex items-center gap-2 text-xs text-ivory/40">
                <MessageCircle size={14} className="text-gold" /> WhatsApp — coming soon
              </li>
              <li>
                <Link to="/showroom" className="flex items-center gap-2 text-xs text-ivory/60 hover:text-ivory transition-colors">
                  <MapPin size={14} className="text-gold" /> Visit Showroom
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs text-ivory/30">Hours coming soon</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-ivory/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-ivory/30">© 2026 Floor and More. All rights reserved.</p>
          <p className="text-xs text-ivory/30">Privacy Policy · Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
