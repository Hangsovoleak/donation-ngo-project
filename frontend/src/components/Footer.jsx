import { Link } from "react-router-dom";

function Footer() {

  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <div className="font-display text-2xl text-slate-900">NGO Discovery</div>
          <p className="text-sm text-slate-600">
            Find verified organizations, learn their missions, and donate safely with
            clear information.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            Verified-first directory
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Quick links
          </div>
          <div className="grid gap-2 text-sm">
            <Link className="text-slate-700 hover:text-slate-900" to="/">
              Home
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/browse">
              Browse NGOs
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/admin/login">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Transparency
          </div>
          <p className="text-sm text-slate-600">
            We do not collect donations. We only share verified information and
            public contact details.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Browse verified NGOs
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200/70">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <span>© 2026 NGO Discovery. All rights reserved.</span>
          <span>Built for clarity, safety, and impact.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
