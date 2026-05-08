import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { Menu, X, ShoppingCart } from "lucide-react";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "Rooms", href: "/products?room=bathroom" },
  { label: "Clearance", href: "/clearance" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useQuoteCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const showSolid = scrolled || !isHome;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          showSolid
            ? "bg-ivory/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                className={showSolid ? "text-forest" : "text-ivory"}
              >
                <rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="2" />
                <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="2" />
                <rect x="4" y="4" width="12" height="12" fill="currentColor" opacity="0.15" />
              </svg>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium tracking-tight leading-none ${
                    showSolid ? "text-forest" : "text-ivory"
                  }`}
                >
                  Teranova
                </span>
                <span
                  className={`text-[10px] tracking-wide leading-none ${
                    showSolid ? "text-forest/60" : "text-ivory/60"
                  }`}
                >
                  Tile &amp; Stone
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative text-[13px] font-normal transition-colors ${
                    showSolid
                      ? "text-forest hover:text-forest-600"
                      : "text-ivory hover:text-ivory/80"
                  } ${
                    (link.href !== "/" && location.pathname === link.href.split("?")[0])
                      ? "font-medium"
                      : ""
                  }`}
                >
                  {link.label}
                  {(link.href !== "/" && location.pathname === link.href.split("?")[0]) && (
                    <span
                      className={`absolute -bottom-1 left-0 w-full h-[1.5px] ${
                        showSolid ? "bg-forest" : "bg-ivory"
                      }`}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/quote"
                className={`hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
                  showSolid
                    ? "bg-forest text-ivory hover:bg-forest-600"
                    : "bg-ivory/20 text-ivory backdrop-blur-sm hover:bg-ivory/30"
                }`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
                </span>
                Get a Quote
                {itemCount > 0 && (
                  <span className="ml-1 flex items-center justify-center w-5 h-5 text-[10px] font-semibold rounded-full bg-gold text-forest">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 ${showSolid ? "text-forest" : "text-ivory"}`}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] bg-ivory">
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-2xl font-light text-forest hover:text-forest-400 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/quote"
              className="mt-4 flex items-center gap-2 px-8 py-3 bg-forest text-ivory rounded-full text-lg font-medium"
            >
              <ShoppingCart size={18} />
              Quote Cart
              {itemCount > 0 && (
                <span className="flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-gold text-forest">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
