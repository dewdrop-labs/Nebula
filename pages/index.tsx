import Features from "./components/Features";
import Footer from "./components/footer";
import { Hero } from "./components/header";
import HowItWorks from "./components/how-it-works";
import Navbar from "./components/navbar";
import Security from "./components/security";
import Testimonials from "./components/testimonial";

export default function Home() {
  return (
    <div className="items-center justify-items-center pt-4 px-16">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Security />
      <Testimonials />
      <Footer />
    </div>
  );
}
