import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/header";
import Footer from "./components/layout/footer";

export function AppLayout() {
  return (
    <section id="index">
      <Navbar />
      <Outlet />
      <Footer />
    </section>
  );
}
