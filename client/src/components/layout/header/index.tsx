import { useMainContext } from "@/context/main-context";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Anasayfa", end: true },
  { to: "index", label: "Kullanıcılar" },
  { to: "Posts", label: "Gönderiler" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollToId } = useMainContext();
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const doScroll = () => scrollToId(id);

    if (location.pathname !== "/") {
      navigate("/");
      requestAnimationFrame(() => setTimeout(doScroll, 0));
    } else {
      doScroll();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="group inline-flex items-center gap-2">
          <span className="text-2xl font-bold tracking-wide text-slate-100">
            Da Vinci Board Games
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to="/"
              onClick={goTo(l.to)}
              end={l.end as boolean | undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition text-slate-100 hover:bg-slate-100 hover:text-slate-900`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menüyü aç/kapat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
    ${
      open
        ? "max-h-96 opacity-100  bg-slate-900 text-white"
        : "max-h-0 opacity-0"
    }`}
        >
          <nav className="mx-auto max-w-6xl px-4 py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to="/"
                onClick={(e) => {
                  goTo(l.to)(e);
                  setOpen(false);
                }}
                end={l.end as boolean | undefined}
                className="block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
