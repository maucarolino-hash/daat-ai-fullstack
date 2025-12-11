import React from 'react';
import Hero from './Hero';
import Navbar from './components/Navbar';
import LogoMarquee from './components/LogoMarquee';
import BentoGrid from './components/BentoGrid';
import DemoSection from './components/DemoSection';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <LogoMarquee />
      <BentoGrid />
      <DemoSection />
      <CTA />
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
