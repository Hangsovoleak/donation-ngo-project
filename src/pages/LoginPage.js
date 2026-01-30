import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const adminData = await authService.login(email, password);
      authService.setAdmin(adminData);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Admin Login
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back. Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@login.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login to Dashboard"}
          </button>

          {/* Footer links */}
          <div className="text-center mt-6 text-sm">
            <span className="text-slate-400">or</span>
            <a
              href="/browse"
              className="block mt-3 text-blue-500 hover:underline"
            >
              Back to Browse Page
            </a>
          </div>
        </form>
      </div>

      <p className="absolute bottom-4 text-xs text-slate-400">
        rork rak team
      </p>
    </div>
  );
}

export default LoginPage;
