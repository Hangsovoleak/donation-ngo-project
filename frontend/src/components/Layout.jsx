/**
 * Software Framework: React (Frontend)
 * Description:
 *      Shared layout wrapper component providing the main header, 
 *      navigation, and footer context for all pages.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Main Layout wrapper.
 * 
 * @param children Page content to be rendered within the layout.
 */
function Layout({ children }) {
  const location = useLocation();
  const isAdminDashboard = location.pathname === "/admin";

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg md:text-2xl font-semibold text-slate-900">
              NGO Discovery
            </div>
          </div>

          <nav className="flex items-center gap-2 md:gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-white rounded-full px-4 py-2 bg-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4 py-2"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/browse"
              className={({ isActive }) =>
                isActive
                  ? "text-white rounded-full px-4 py-2 bg-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4 py-2"
              }
            >
              Browse NGOs
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={isAdminDashboard ? "" : "max-w-screen-xl mx-auto px-4 py-10"}>
        {children}
      </main>

      {!isAdminDashboard ? <Footer /> : null}
    </div>
  );
}

export default Layout;
