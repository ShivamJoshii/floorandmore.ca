import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";

const showroom = {
  address: "7127 Roper Road NW",
  city: "Edmonton",
  province: "AB",
  postalCode: "T6K 3B3",
  phone: "(780) 937-8600",
  phoneHref: "+17809378600",
  email: "info@floorandmore.ca",
  mapUrl:
    "https://www.google.com/maps?q=7127+Roper+Road+NW+Edmonton+AB+T6K+3B3&output=embed",
};

const hours = [
  { day: "Monday", open: "9:00 AM", close: "6:00 PM" },
  { day: "Tuesday", open: "9:00 AM", close: "6:00 PM" },
  { day: "Wednesday", open: "9:00 AM", close: "6:00 PM" },
  { day: "Thursday", open: "9:00 AM", close: "6:00 PM" },
  { day: "Friday", open: "9:00 AM", close: "6:00 PM" },
  { day: "Saturday", open: "10:00 AM", close: "5:00 PM" },
  { day: "Sunday", open: "Closed", close: "Closed" },
];

export default function Showroom() {
  const [bookingModal, setBookingModal] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => {
      setBookingModal(false);
      setBooked(false);
    }, 2000);
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-forest pt-28 pb-16 text-center">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-gold">Visit Us</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-ivory mt-3 mb-4">
            Bring your measurements. We&apos;ll help you choose.
          </h1>
          <p className="text-base text-ivory/70 max-w-2xl mx-auto">
            Our showroom is designed for browsing. No pressure. No jargon. Just great surfaces and honest advice.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-12 pb-32">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Info */}
          <div className="space-y-6">
            <div className="bg-bone rounded-xl p-8 space-y-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-forest">{showroom.address}</p>
                  <p className="text-sm text-forest">{showroom.city}, {showroom.province} {showroom.postalCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <a href={`tel:${showroom.phoneHref}`} className="text-sm text-forest hover:text-forest-600">{showroom.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <a href={`mailto:${showroom.email}`} className="text-sm text-forest-400 hover:text-forest">{showroom.email}</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-gold shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-forest mb-2">Hours</p>
                  <div className="space-y-1">
                    {hours.map((h) => (
                      <div key={h.day} className="flex justify-between text-xs text-stone w-48">
                        <span>{h.day}</span>
                        <span>{h.open === "Closed" ? "Closed" : `${h.open} - ${h.close}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setBookingModal(true)}
                className="px-6 py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors"
              >
                Book a Visit
              </button>
              <Link
                to="/contact"
                className="px-6 py-3 border-[1.5px] border-forest text-forest rounded-full text-sm font-medium hover:bg-forest-50 transition-colors"
              >
                Send Project Photos
              </Link>
            </div>
          </div>

          {/* Right: Map */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-forest-50">
              <iframe
                src={showroom.mapUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Showroom Location"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src="/images/hero/hallway.jpg" alt="Showroom" className="aspect-square rounded-lg object-cover" />
              <img src="/images/hero/kitchen.jpg" alt="Showroom" className="aspect-square rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setBookingModal(false)} />
          <div className="relative bg-ivory rounded-xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => setBookingModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-stone hover:bg-linen transition-colors"
            >
              ✕
            </button>
            {booked ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="mx-auto text-status-good mb-3" />
                <h3 className="text-lg font-medium text-forest">Appointment Requested!</h3>
                <p className="text-sm text-stone mt-1">We&apos;ll confirm your booking shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium text-forest mb-4">Book a Showroom Visit</h3>
                <form onSubmit={handleBooking} className="space-y-4">
                  <input required placeholder="Name" className="w-full h-10 px-3 border border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none" />
                  <input required type="tel" placeholder="Phone" className="w-full h-10 px-3 border border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none" />
                  <input required type="email" placeholder="Email" className="w-full h-10 px-3 border border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none" />
                  <input required type="date" className="w-full h-10 px-3 border border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none" />
                  <select className="w-full h-10 px-3 border border-linen rounded-md text-sm focus:border-forest-400 focus:outline-none">
                    <option>Morning (9am-12pm)</option>
                    <option>Afternoon (12pm-4pm)</option>
                  </select>
                  <button type="submit" className="w-full py-3 bg-forest text-ivory rounded-full text-sm font-medium hover:bg-forest-600 transition-colors">
                    Request Appointment
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
