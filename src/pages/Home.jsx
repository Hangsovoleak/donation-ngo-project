import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-12">
            <section className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-ink">
                    NGO Donation Directory
                </h1>
                <p className="mt-3 text-brand-ink/70 max-w-2xl mx-auto">
                    A safe and transparent way to find verified NGOs and donate with confidence.
                </p>
                <div className="mt-6">
                    <Link
                        to="/browse"
                        className="inline-flex items-center gap-2 text-white bg-brand-blue hover:bg-brand-ink border border-transparent focus:ring-4 focus:ring-brand-soft font-medium leading-5 rounded-full text-sm px-5 py-2.5 shadow-sm"
                    >
                        Explore Our Website
                    </Link>
                </div>
            </section>

            <section className="mt-10">
                <div className="grid gap-4 md:grid-cols-3">
                    <img
                        src="/images/image1.jpg"
                        alt="Children receiving school supplies"
                        className="h-56 w-full rounded-2xl object-cover border border-brand-soft shadow-sm"
                        loading="lazy"
                    />
                    <img
                        src="/images/images2.jpg"
                        alt="Students smiling and waving"
                        className="h-56 w-full rounded-2xl object-cover border border-brand-soft shadow-sm"
                        loading="lazy"
                    />
                    <img
                        src="/images/image3.jpg"
                        alt="Students reading together"
                        className="h-56 w-full rounded-2xl object-cover border border-brand-soft shadow-sm"
                        loading="lazy"
                    />
                </div>
            </section>

            <section className="mt-10 bg-white rounded-2xl p-6 border border-brand-soft shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold text-brand-ink text-center">
                    Why You Can Trust This Platform
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div className="text-brand-ink/70">
                        <div className="font-semibold text-brand-ink mb-2">Verified NGOs</div>
                        <p>
                            All listed NGOs are verified for authenticity and transparency. We check
                            registration details and credentials.
                        </p>
                    </div>
                    <div className="text-brand-ink/70">
                        <div className="font-semibold text-brand-ink mb-2">No Money Collected</div>
                        <p>
                            We do not handle any donations. All contributions are made directly to NGOs
                            through their official channels.
                        </p>
                    </div>
                    <div className="text-brand-ink/70">
                        <div className="font-semibold text-brand-ink mb-2">Clear Donation Information</div>
                        <p>
                            Each NGO profile includes complete details on how to donate safely and what
                            they need.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mt-8 bg-brand-soft/60 rounded-full p-4 border border-brand-blue text-center text-brand-ink">
                We do not collect donations. We only share verified information.
            </div>

            <footer className="mt-12 border-t border-brand-soft pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://www.tuxglobalinstitute.edu.kh/_ipx/w_300&f_webp/images/TGI-Logo.png"
                            alt="TUX Global Institute logo"
                            className="h-10 w-auto"
                            loading="lazy"
                        />
                    </div>
                    <div className="text-sm text-brand-ink/70 md:text-right">
                        <div className="font-semibold text-brand-ink">Members</div>
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Panha
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Voleak
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Monika
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Nyda
                            </span>
                            <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">
                                Darith
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
