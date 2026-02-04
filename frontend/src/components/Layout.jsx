import { NavLink } from "react-router-dom";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-base text-brand-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#ffffff,transparent_65%)]" />

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl md:text-2xl font-display text-slate-900">
              NGO Discovery
            </div>
          </div>

          <nav className="flex items-center gap-2 md:gap-4 text-xs font-semibold uppercase tracking-widest text-slate-600">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-white rounded-full px-4 py-2 bg-slate-900 shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4 py-2"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/browse"
              className={({ isActive }) =>
                isActive
                  ? "text-white rounded-full px-4 py-2 bg-slate-900 shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4 py-2"
              }
            >
              Browse NGOs
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-10">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
