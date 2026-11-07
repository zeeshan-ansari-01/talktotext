import { Outlet } from "react-router-dom";
import Header from "@/components/home/Header";
import { Toaster } from "@/components/ui/toaster";
import ScrollToHash from "@/components/common/ScrollToHash";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ScrollToHash />
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}