import { Dot } from "lucide-react";

import BgGradient from "@/components/common/BgGradient";
import Banner from "@/components/home/Banner";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";

const Dots = () => (
  <div className="flex items-center justify-center">
    <Dot className="text-purple-400" />
    <Dot className="text-purple-400" />
    <Dot className="text-purple-400" />
  </div>
);

export default function Home() {
  return (
    <main className="mx-auto w-full inset-0 h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <BgGradient />
      <Banner />
      <Dots />
      <HowItWorks />
      <Dots />
      <Pricing />
      <Dots />

      <footer className="bg-gray-200/20 flex h-20 py-24 px-12 z-20 relative overflow-hidden flex-col gap-2">
        <p>All Rights Reserved, {new Date().getFullYear()}</p>
        <a href="https://github.com/zeeshan-ansari-01" target="_blank" rel="noreferrer">
          Built by Zeeshan Ansari 🚀
        </a>
      </footer>
    </main>
  );
}