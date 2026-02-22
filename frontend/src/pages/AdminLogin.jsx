// AdminLogin page flow:
// Step 1: Capture email/password from form.
// Step 2: Call login endpoint.
// Step 3: Save access + refresh tokens.
// Step 4: Redirect to /admin on success.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/admin.service";
import { setAccessToken, setRefreshToken } from "../utils/authStorage";

function AdminLogin() {
    const navigate = useNavigate();

    // Controlled form + request status.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    // Main auth action for this screen.
    async function handleSubmit(event) {
        event.preventDefault();
        setErr("");

        if (!email || !password) {
            setErr("Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            // Step 2: Request JWT tokens from backend.
            const res = await loginAdmin({ email, password });
            const token = res?.data?.token;
            const refreshToken = res?.data?.refreshToken;
            if (!token || !refreshToken) {
                setErr("Login failed. No token returned.");
                return;
            }
            // Step 3: Persist tokens for authenticated API calls.
            setAccessToken(token);
            setRefreshToken(refreshToken);
            // Step 4: Enter protected admin dashboard.
            navigate("/admin");
        } catch (e) {
            // Show backend message when available.
            const message = e?.response?.data?.message || "Invalid email or password.";
            setErr(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-blue-600 px-4">
            <div className="relative w-full max-w-md">
                <div className="relative card p-4 md:p-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4 md:pb-5">
                        <h3 className="text-lg font-semibold text-slate-900">Sign in for Admin</h3>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900 rounded-md text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                            aria-label="Close"
                        >
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                />
                            </svg>
                        </button>
                    </div>

                    {err && <div className="mt-4 text-sm text-red-600">{err}</div>}

                    <form onSubmit={handleSubmit} className="pt-4 md:pt-6">
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-slate-700">
                                Your email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 block w-full px-3 py-2.5 placeholder:text-slate-400"
                                placeholder="example@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-slate-700">
                                Your password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-10 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 block w-full px-3 py-2.5 placeholder:text-slate-400"
                                placeholder="••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary text-sm w-full mb-3 disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login to your account"}
                        </button>
                        <div className="mt-3 text-xs text-slate-500">
                            Demo account: <span className="font-medium">admin@login.com</span> /{" "}
                            <span className="font-medium">6767</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
