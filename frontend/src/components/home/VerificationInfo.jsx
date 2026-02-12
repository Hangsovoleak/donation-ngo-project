import { ShieldCheck, CheckCircle, Building2, Heart } from "lucide-react";

// Home page component: Verification information section
function VerificationInfo() {
    return (
        <section className="card p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white">
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                            How Verification Works
                        </h2>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Our verification process ensures you can donate with confidence. Each verified NGO undergoes a thorough review by our admin team to confirm their legitimacy and active operations.
                    </p>
                    <div className="mt-5 space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                            <div>
                                <span className="font-semibold text-slate-900">Identity Verification:</span>
                                <span className="text-sm text-slate-600"> We confirm the organization's legal registration and operational status.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                            <div>
                                <span className="font-semibold text-slate-900">Contact Validation:</span>
                                <span className="text-sm text-slate-600"> Active phone numbers, addresses, and communication channels are verified.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                            <div>
                                <span className="font-semibold text-slate-900">Mission Review:</span>
                                <span className="text-sm text-slate-600"> Clear documentation of their cause, beneficiaries, and impact areas.</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <p className="text-sm text-amber-900">
                            <strong>Note:</strong> You can still support unverified NGOs, but we strongly recommend verifying their details directly before making any donations.
                        </p>
                    </div>
                </div>
                <div className="grid gap-3 content-start">
                    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white px-4 py-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <ShieldCheck className="text-green-600" size={16} />
                            </div>
                            <div className="text-xs font-bold text-green-900 uppercase tracking-widest">
                                Verified Badge
                            </div>
                        </div>
                        <div className="text-sm text-slate-700">
                            Look for the green "Verified NGO" badge on profile cards to identify trusted organizations.
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white px-4 py-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Building2 className="text-blue-600" size={16} />
                            </div>
                            <div className="text-xs font-bold text-blue-900 uppercase tracking-widest">
                                Transparency
                            </div>
                        </div>
                        <div className="text-sm text-slate-700">
                            Verified NGOs provide clear donation instructions, contact channels, and mission statements.
                        </div>
                    </div>
                    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white px-4 py-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Heart className="text-purple-600" size={16} />
                            </div>
                            <div className="text-xs font-bold text-purple-900 uppercase tracking-widest">
                                Safe Giving
                            </div>
                        </div>
                        <div className="text-sm text-slate-700">
                            Always confirm donation details directly with the NGO before sending funds for maximum security.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default VerificationInfo;
