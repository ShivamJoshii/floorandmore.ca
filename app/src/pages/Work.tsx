import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

const categories = ["all", "bathroom", "kitchen", "flooring", "commercial", "outdoor"];
const categoryLabels: Record<string, string> = {
  all: "All", bathroom: "Bathroom", kitchen: "Kitchen", flooring: "Flooring", commercial: "Commercial", outdoor: "Outdoor",
};

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data, isLoading } = trpc.project.list.useQuery(
    activeCategory !== "all" ? { category: activeCategory } : undefined
  );

  return (
    <div className="bg-ivory min-h-screen">
      <div className="bg-forest-50 pt-24 pb-8">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Our Work</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-forest mt-2">
            Projects we&apos;re proud of.
          </h1>
          <p className="text-base text-charcoal/70 max-w-xl mt-3">
            Real spaces, real clients, real craftsmanship. Every photo is a project we completed from selection to installation.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-50 bg-ivory border-b border-linen">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium border-[1.5px] transition-all ${
                  activeCategory === cat ? "bg-forest text-ivory border-forest" : "bg-transparent text-forest border-linen hover:bg-linen"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-10 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-bone rounded-lg animate-pulse" />
            ))}
          </div>
        ) : data?.projects && data.projects.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="group relative break-inside-avoid rounded-lg overflow-hidden"
              >
                <img
                  src={Array.isArray(project.images) ? project.images[0] : "/images/projects/project1.jpg"}
                  alt={project.name}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/60 transition-colors flex flex-col items-center justify-center p-4">
                  <h3 className="text-lg font-light text-ivory opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity mt-1 capitalize">
                    {project.category}
                  </p>
                  <p className="text-xs text-ivory/70 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                    {project.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-light text-stone">No projects in this category yet.</h3>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-forest py-16 text-center">
        <div className="mx-auto max-w-[1400px] px-6">
          <h2 className="text-2xl md:text-3xl font-light text-ivory mb-3">
            Have a project in mind?
          </h2>
          <p className="text-base text-ivory/70 mb-6">
            Let&apos;s talk about your space. Free consultations, honest advice, no obligation.
          </p>
          <Link
            to="/quote"
            className="inline-flex px-8 py-3 bg-gold text-forest rounded-full text-sm font-medium hover:bg-gold-300 transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
