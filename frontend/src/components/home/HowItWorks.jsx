/**
 * Software Framework: React (Frontend)
 * Description:
 *      An informational section explaining the platform's multi-step donation 
 *      discovery process using illustrative steps and media.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Search, Heart, CheckCircle, ShieldCheck } from "lucide-react";

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Instructional "How It Works" component.
 */
function HowItWorks() {
    return (
        <section className="card p-8 md:p-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-4xl font-bold gradient-text">
                    How Donation Works
                </h2>
                <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                    Making a difference is simple. Follow these easy steps to support verified NGOs and create positive change in your community.
                </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-2 items-center">
                {/* Media Explanation Area */}
                <div className="order-2 lg:order-1">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src="https://i.pinimg.com/originals/e2/4c/98/e24c982529555d858850910b8ea8fc8c.gif"
                            alt="Donation process animation"
                            className="w-full h-auto"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                    <p className="mt-4 text-xs text-center text-slate-500 italic">
                        Process: Browse → Select → Donate → Impact
                    </p>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="order-1 lg:order-2 space-y-5">
                    <div className="flex gap-4 group">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                1
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Search size={20} className="text-blue-600" />
                                Browse NGOs
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Search through our directory of verified NGOs. Filter by category, location, or cause to find organizations that align with your values.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 group">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                2
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Heart size={20} className="text-green-600" />
                                Choose Your Cause
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Review detailed NGO profiles including their mission, impact areas, and beneficiaries. Check verification status and donation instructions.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 group">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-50 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                3
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle size={20} className="text-purple-600" />
                                Make Secure Donation
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Contact the NGO directly through provided channels (phone, website, or visit). Follow their secure donation process to contribute safely.
                            </p>
                        </div>
                    </div>

                    {/* Safety Context */}
                    <div className="mt-6 info-box">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="text-green-600 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-slate-900">Safety First</h4>
                                <p className="text-sm text-slate-700 mt-1">
                                    We verify NGO legitimacy, but always confirm donation details directly with the organization before sending funds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
