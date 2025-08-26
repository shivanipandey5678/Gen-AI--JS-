import { Button } from "@/components/ui/button";
import { Hero1 } from "./components/blocks/Hero.jsx";
import Navbar from "./components/blocks/Navbar.jsx";
import { MarqueeDemo } from "@/components/blocks/Testimonal.jsx";
import { Heading1 } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import Features from "./components/blocks/Features.jsx";
import { Separator } from "@/components/ui/separator"
import Contact from "./components/blocks/Contact.jsx";
import Footer from "./components/blocks/Footer.jsx";

function App() {
  return (
    <div className="flex min-h-vh flex-col items-center justify-center  md:mx-0 mx-4">
      <Navbar />
      <Separator />
      <Hero1 />
      <Features />

      <section className="w-full max-w-7xl mx-auto overflow-hidden px-4 py-12" id='testimonal'>
        <div className="py-4">
          <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
            Testimonals
          </h1>
        </div>
        <MarqueeDemo />

      </section>
      <Contact />
      <Separator />
      <Footer/>

    </div>
  )
}

export default App