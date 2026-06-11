import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Mission from "@/components/sections/Mission";
import Platform from "@/components/sections/Platform";
import AI from "@/components/sections/AI";
import Customers from "@/components/sections/Customers";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#070912]">
      <Navbar />
      <Hero />
      <Mission />
      <Platform />
      <AI />
      <Customers />
      <Contact />
      <Footer />
    </main>
  );
}
