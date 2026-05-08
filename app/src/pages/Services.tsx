import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Bath, ChefHat, Building2, CheckCircle } from "lucide-react";

const services = [
  {
    name: "Bathroom Renovations",
    description: "Full gut-to-finish bathroom renovations. Waterproofing, tiling, fixture installation, and finishing. We handle everything from demolition to the final grout line.",
    icon: Bath,
    features: ["Demolition & disposal", "Waterproofing systems", "Tile installation (walls & floor)", "Fixture & vanity installation", "Grout sealing & finishing"],
    image: "/images/projects/project1.jpg",
  },
  {
    name: "Kitchen Tiling",
    description: "Backsplashes, flooring, island cladding. Precision cuts around outlets, appliances, and corners. We make your kitchen the heart of your home.",
    icon: ChefHat,
    features: ["Backsplash design & install", "Floor tile installation", "Island & peninsula tiling", "Precision edge cuts", "Grout colour matching"],
    image: "/images/projects/project2.jpg",
  },
  {
    name: "Flooring & Commercial",
    description: "Large-format flooring, commercial-grade installation, rapid turnaround for business clients. From condos to corporate offices.",
    icon: Building2,
    features: ["Large-format porcelain", "Engineered hardwood", "Commercial vinyl", "Rapid project turnaround", "After-hours installation"],
    image: "/images/projects/project4.jpg",
  },
];

const processSteps = [
  { number: "1", name: "Consultation", description: "We visit your space, take measurements, and understand your vision and budget." },
  { number: "2", name: "Selection", description: "Browse our showroom or catalogue. We help you choose the right products for your needs." },
  { number: "3", name: "Installation", description: "Our certified team handles everything with precision and care, on schedule." },
  { number: "4", name: "Completion", description: "Final walkthrough, touch-ups, and a space you'll love for years to come." },
];

export default function Services() {
  const { data: featuredProjects } = trpc.project.featured.useQuery();

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-forest pt-28 pb-20 text-center">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-light tracking-tight text-ivory mb-4">
            Full-Service Renovation.
          </h1>
          <p className="text-base md:text-lg text-ivory/70 max-w-2xl mx-auto mb-8">
            We don&apos;t just sell surfaces — we install them with precision, care, and decades of combined experience.
          </p>
          <Link
            to="/quote"
            className="inline-flex px-8 py-3 bg-gold text-forest rounded-full text-sm font-medium hover:bg-gold-300 transition-colors"
          >
            Get a Renovation Quote
          </Link>
        </div>
      </div>

      {/* Services List */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-16 space-y-12">
        {services.map((service) => (
          <div key={service.name} className="grid md:grid-cols-[40%_60%] gap-8 items-center bg-bone rounded-xl overflow-hidden">
            <div className="aspect-[16/10] md:aspect-auto md:h-full">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:p-10">
              <service.icon size={28} className="text-gold mb-4" />
              <h3 className="text-xl font-light text-forest mb-3">{service.name}</h3>
              <p className="text-sm text-charcoal/80 leading-relaxed mb-5">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-charcoal">
                    <CheckCircle size={14} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/quote" className="text-sm text-gold hover:underline underline-offset-4">
                Get a Quote →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Process */}
      <div className="bg-forest-50 py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">How It Works</span>
          <h2 className="text-2xl md:text-3xl font-light text-forest mt-2 mb-12">
            From consultation to completion.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-[1px] bg-gold/30" />
            {processSteps.map((step) => (
              <div key={step.number} className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-4 bg-forest-50">
                  <span className="text-sm font-medium text-gold">{step.number}</span>
                </div>
                <h4 className="text-sm font-medium text-forest mb-2">{step.name}</h4>
                <p className="text-xs text-stone leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Teaser */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-16">
        <h2 className="text-2xl font-light text-forest mb-8">Recent Projects</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(featuredProjects || []).slice(0, 4).map((project) => (
            <div key={project.id} className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={Array.isArray(project.images) ? project.images[0] : "/images/projects/project1.jpg"}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/work" className="inline-flex px-8 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors">
            View All Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
