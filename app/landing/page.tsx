import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BusinessAreas from "@/components/landing/BusinessAreas";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0908] text-[#F5E9D8]">

      <Navbar />

      <Hero />

      <BusinessAreas />

      <Features />

      <HowItWorks />

      <Pricing />

      <FAQ />

      <Footer />

    </main>
  );
}