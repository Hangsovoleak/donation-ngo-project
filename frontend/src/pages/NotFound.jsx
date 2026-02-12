// Page: 404 fallback when a route does not exist.
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md text-center card p-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Error 404
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary text-sm"
          >
            Go home
          </Link>
          <Link
            to="/browse"
            className="btn-outline text-sm"
          >
            Browse NGOs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
