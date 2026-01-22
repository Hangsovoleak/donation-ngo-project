import { useState, useEffect } from "react";
import { useParams, Link} from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";

    const ngoData = [
        {
            id: 1,
            name: "Cambodian Children's Fund",
            description: "Providing education and healthcare to children in rural areas.",
            city: "Phnom Penh",
            categories: ["Education", "Healthcare"],
            beneficiaries: ["Children"],
            verified: true,
            phone: "+855 12 345 678",
            website: "https://example.com",
            locations: ["Location 1", "Location 2"],
        },
        {
            id: 2,
            name: "Elderly Care Network",
            description: "Supporting elderly communities with food and medical aid.",
            city: "Siem Reap",
            categories: ["Food", "Healthcare"],
            beneficiaries: ["Elderly"],
            verified: false,
            phone: "+855 98 765 432",
            website: "https://example2.com",
            locations: ["Location A"],
        },
        {
            id: 3,
            name: "Community Clothing Drive",
            description: "Distributing clothing to underserved families.",
            city: "Battambang",
            categories: ["Clothing"],
            beneficiaries: ["Community"],
            verified: true,
            phone: "+855 23 456 789",
            website: "https://example3.com",
            locations: ["Location X", "Location Y"],
        },
    ];

function ProfilePage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [ngo, setNgo] = useState(null);

    useEffect(() => {
        const foundNgo = ngoData.find(n => n.id === parseInt(id));
        setNgo(foundNgo);
        setLoading(false);
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!ngo) return <div className="p-10 text-center text-slate-500">NGO not found.</div>;

    return (
        <div className="min-h-screen bg-[#f4f7f6] text-slate-800 font-sans p-4 md:p-8">
            <main className="max-w-5xl mx-auto">
                
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/browse" className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors">
                        <span className="bg-white p-2 rounded-full shadow-sm text-xs">←</span>
                        <span className="text-sm font-medium">Back to Browse</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">{ngo.name}</h1>
                                    <p className="text-blue-500 font-medium flex items-center gap-1">
                                        <span className="text-lg">📍</span> {ngo.city}
                                    </p>
                                </div>
                                {ngo.verified && (
                                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100 uppercase tracking-wider">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-slate-500 leading-relaxed text-lg mb-8">
                                {ngo.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {ngo.categories.map(cat => (
                                    <span key={cat} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">Donation Locations</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ngo.locations.map((loc, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500">🏠</div>
                                        <span className="font-medium text-slate-700">{loc}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Contact Widget */}
                    <div className="space-y-6">
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">Contact Details</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                                    <p className="text-lg font-semibold">{ngo.phone}</p>
                                </div>
                                
                                <div className="pb-6 border-b border-slate-100">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Website</label>
                                    <a href={ngo.website} className="text-blue-500 font-semibold hover:underline break-all">
                                        {ngo.website.replace('https://', '')}
                                    </a>
                                </div>

                                <button className="w-full bg-[#93c5fd] hover:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100">
                                    Donate Now
                                </button>
                            </div>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default ProfilePage;