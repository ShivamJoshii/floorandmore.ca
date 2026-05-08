import { Routes, Route } from "react-router";
import { QuoteCartProvider } from "@/contexts/QuoteCartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteBar from "@/components/QuoteBar";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Collections from "@/pages/Collections";
import CollectionDetail from "@/pages/CollectionDetail";
import Quote from "@/pages/Quote";
import Samples from "@/pages/Samples";
import Showroom from "@/pages/Showroom";
import Clearance from "@/pages/Clearance";
import Work from "@/pages/Work";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import BusinessQR from "@/pages/BusinessQR";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ComingSoon from "@/components/ComingSoon";
import ScrollToTop from "@/components/ScrollToTop";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[100dvh]">{children}</main>
      <Footer />
      <QuoteBar />
    </>
  );
}

export default function App() {
  return (
    <QuoteCartProvider>
      <ScrollToTop />
      <Routes>
        {/* Business QR page without navbar/footer */}
        <Route path="/business-qr" element={<BusinessQR />} />
        <Route path="/login" element={<Login />} />

        {/* Main pages with layout */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/products"
          element={
            <AppLayout>
              <Products />
            </AppLayout>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <AppLayout>
              <ProductDetail />
            </AppLayout>
          }
        />
        <Route
          path="/collections"
          element={
            <AppLayout>
              <Collections />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:slug"
          element={
            <AppLayout>
              <CollectionDetail />
            </AppLayout>
          }
        />
        <Route
          path="/quote"
          element={
            <AppLayout>
              <Quote />
            </AppLayout>
          }
        />
        <Route
          path="/samples"
          element={
            <AppLayout>
              <Samples />
            </AppLayout>
          }
        />
        <Route
          path="/showroom"
          element={
            <AppLayout>
              <Showroom />
            </AppLayout>
          }
        />
        <Route
          path="/clearance"
          element={
            <AppLayout>
              <Clearance />
            </AppLayout>
          }
        />
        <Route
          path="/work"
          element={
            <AppLayout>
              <Work />
            </AppLayout>
          }
        />
        <Route
          path="/services"
          element={
            <AppLayout>
              <Services />
            </AppLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <AppLayout>
              <Contact />
            </AppLayout>
          }
        />
        <Route
          path="/rooms"
          element={
            <AppLayout>
              <ComingSoon
                title="Browse by Room — coming soon."
                description="We're putting together curated picks for bathrooms, kitchens, living spaces, outdoor, and commercial. In the meantime, browse the full product catalog."
              />
            </AppLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QuoteCartProvider>
  );
}
