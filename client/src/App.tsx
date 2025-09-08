import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/header";
import Footer from "./components/layout/footer";
import { Toaster } from "react-hot-toast";

export function AppLayout() {
  return (
    <section id="index">
      <Navbar />
      <Outlet />
      <Footer />

      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 100000 }}
        toastOptions={{
          duration: 2500,
          className:
            "bg-slate-900 text-slate-100 border border-slate-700 shadow-lg",
        }}
      />
    </section>
  );
}
