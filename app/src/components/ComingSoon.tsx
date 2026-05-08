import { Link } from "react-router";
import { Clock } from "lucide-react";

type Props = {
  title: string;
  description?: string;
};

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="bg-ivory min-h-[80vh] flex items-center">
      <div className="mx-auto max-w-[640px] px-6 md:px-12 py-24 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-forest-50 mb-6">
          <Clock size={22} className="text-gold" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Coming soon</span>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-forest mt-2 mb-4">
          {title}
        </h1>
        <p className="text-sm md:text-base text-stone leading-relaxed mb-8">
          {description ??
            "We're putting this section together. Check back soon — or get in touch if you'd like a preview."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
