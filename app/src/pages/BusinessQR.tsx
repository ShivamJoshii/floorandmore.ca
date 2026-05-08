import { trpc } from "@/providers/trpc";
import {
  Globe,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  FileText,
  MapPin,
  Instagram,
  ArrowRight,
} from "lucide-react";

type QRLink = {
  icon: typeof Globe;
  label: string;
  href: string;
  description: string;
  comingSoon?: boolean;
};

const links: QRLink[] = [
  { icon: Globe, label: "Website", href: "/", description: "floorandmore.ca" },
  { icon: BookOpen, label: "Catalogue", href: "/products", description: "View Product Catalogue" },
  { icon: FileText, label: "Get a Quote", href: "/quote", description: "Request a Free Quote" },
  { icon: MapPin, label: "Visit Showroom", href: "/showroom", description: "Address coming soon" },
  { icon: MessageCircle, label: "WhatsApp", href: "#", description: "Coming soon", comingSoon: true },
  { icon: Phone, label: "Call", href: "#", description: "Coming soon", comingSoon: true },
  { icon: Mail, label: "Email", href: "#", description: "Coming soon", comingSoon: true },
  { icon: Instagram, label: "Instagram", href: "#", description: "Coming soon", comingSoon: true },
];

export default function BusinessQR() {
  const { data: teamMembers } = trpc.team.list.useQuery();
  const { data: showroom } = trpc.showroom.info.useQuery();

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/images/web.svg" alt="Floor and More" className="h-16 w-auto bg-ivory rounded-lg p-2" />
          </div>
          <p className="text-xs text-gold mb-1">Floor and More</p>
          <p className="text-sm text-ivory/70">Premium tiles, slabs &amp; renovation services.</p>
        </div>

        {/* Links */}
        <div className="space-y-3 mb-8">
          {links.map((link) => {
            if (link.comingSoon) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-4 w-full h-[52px] px-5 rounded-full bg-ivory/[0.04] border border-ivory/[0.10] text-ivory/40 cursor-not-allowed"
                >
                  <link.icon size={20} className="text-gold/50 shrink-0" />
                  <span className="flex-1 text-sm text-left">{link.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-ivory/40">Coming soon</span>
                </div>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") || link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 w-full h-[52px] px-5 rounded-full bg-ivory/[0.08] border border-ivory/[0.15] text-ivory hover:bg-ivory/[0.15] transition-colors group"
              >
                <link.icon size={20} className="text-gold shrink-0" />
                <span className="flex-1 text-sm text-left">{link.label}</span>
                <ArrowRight size={16} className="text-ivory/40 group-hover:text-ivory/60 transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Team */}
        <div className="border-t border-ivory/15 pt-6">
          <p className="text-xs text-ivory/50 text-center mb-4">Our Team</p>
          <div className="space-y-3">
            {(teamMembers || []).map((member) => (
              <a
                key={member.id}
                href={`https://wa.me/${member.whatsappNumber?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ivory/[0.08] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold shrink-0">
                  <img
                    src={member.avatarUrl || "/images/team/marco.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ivory font-medium truncate">{member.name}</p>
                  <p className="text-xs text-ivory/50 truncate">{member.role}</p>
                </div>
                <MessageCircle size={16} className="text-gold shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-ivory/10">
          <p className="text-xs text-ivory/40 mb-1">Scan to save our contact</p>
          <p className="text-xs text-ivory/25">© 2026 Floor and More</p>
        </div>
      </div>
    </div>
  );
}
