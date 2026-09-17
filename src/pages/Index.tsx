import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/landing/Hero";
import { Collections } from "@/components/landing/Collections";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Portfolio } from "@/components/landing/Portfolio";
import { Personalization } from "@/components/landing/Personalization";
import { Comparison } from "@/components/landing/Comparison";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SiteHeader />
    <main>
      <Hero />
      <Collections />
      <Features />
      <HowItWorks />
      <Portfolio />
      <Personalization />
      <Comparison />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
    <SiteFooter />
  </div>
);

export default Index;
