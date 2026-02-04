import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setErr("");

        if (!email || !password) {
            setErr("Please enter email and password.");
            return;
        }

        setLoading(true);

        if(email === 'admin@login.com' && password === "6767") {
            localStorage.setItem("AdminToken", "demo-token");
            navigate("/admin");
        } else {
            setErr("Invalid email or password.");
        }

        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white px-4">
            <div className="relative w-full max-w-md">
                <div className="relative bg-white border border-brand-soft rounded-2xl shadow-xl p-4 md:p-6">
                    <div className="flex items-center justify-between border-b border-brand-soft pb-4 md:pb-5">
                        <h3 className="text-lg font-semibold text-brand-ink">Sign in for Admin</h3>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-brand-ink/70 bg-transparent hover:bg-brand-soft/60 hover:text-brand-ink rounded-md text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
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

                    {err && <div className="mt-4 text-sm text-brand-red">{err}</div>}

                    <form onSubmit={handleSubmit} className="pt-4 md:pt-6">
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-brand-ink">
                                Your email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white border border-brand-soft text-brand-ink text-sm rounded-lg focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple block w-full px-3 py-2.5 shadow-sm placeholder:text-brand-ink/40"
                                placeholder="example@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-brand-ink">
                                Your password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-10 bg-white border border-brand-soft text-brand-ink text-sm rounded-lg focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple block w-full px-3 py-2.5 shadow-sm placeholder:text-brand-ink/40"
                                placeholder="•••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-brand-blue border border-transparent hover:bg-brand-purple focus:ring-4 focus:ring-brand-purple/30 shadow-sm font-medium leading-5 rounded-full text-sm px-4 py-2.5 w-full mb-3"
                        >
                            {loading ? "Logging in..." : "Login to your account"}
                        </button>
                        <div className="mt-3 text-xs text-brand-ink/70">
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
