import { Link } from "react-router";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { ShoppingCart, X } from "lucide-react";

export default function QuoteBar() {
  const { items, removeItem, itemCount } = useQuoteCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] bg-forest shadow-lg">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <ShoppingCart size={18} className="text-gold" />
            <span className="text-sm text-ivory">
              <strong>{itemCount}</strong> {itemCount === 1 ? "item" : "items"} in quote
            </span>
            <div className="hidden sm:flex items-center gap-2 ml-4">
              {items.slice(0, 3).map((item) => (
                <div key={item.productId} className="relative group">
                  <img
                    src={typeof item.image === "string" ? item.image : "/images/collections/swatches.jpg"}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover border border-ivory/20"
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-forest rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {items.length > 3 && (
                <span className="text-xs text-ivory/60">+{items.length - 3}</span>
              )}
            </div>
          </div>
          <Link
            to="/quote"
            className="px-6 py-2 bg-gold text-forest text-sm font-medium rounded-full hover:bg-gold-300 transition-colors"
          >
            View Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
