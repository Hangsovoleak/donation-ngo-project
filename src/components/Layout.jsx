import { NavLink } from "react-router-dom";

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-white text-brand-ink">
            <header className="border-b border-brand-soft bg-sky-50 backdrop-blur">
                <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-bold text-brand-ink">
                        NGO Directory
                    </div>

                    <nav className="flex items-center gap-4 md:gap-8 text-xs font-semibold">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-brand-ink rounded-full px-4 py-2 bg-brand-soft border border-brand-blue font-bold"
                                    : "text-brand-ink/70 hover:text-brand-ink"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/browse"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-brand-ink rounded-full px-4 py-2 bg-brand-soft border border-brand-blue font-bold"
                                    : "text-brand-ink/70 hover:text-brand-ink"
                            }
                        >
                            Browse NGOs
                        </NavLink>
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-brand-ink rounded-full px-4 py-2 bg-brand-soft border border-brand-blue font-bold"
                                    : "text-brand-ink/70 hover:text-brand-ink"
                            }
                        >
                            Admin
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto px-4 py-8">{children}</main>
        </div>
    );
}

export default Layout;
