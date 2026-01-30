import { Link } from 'react-router-dom';

function NGOCard({ ngo }) {
    return (
        <div className="group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between border border-transparent hover:border-blue-50">

            {/* Top Section: Avatar & Status */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {/* Check if any category name includes "Education" */}
                    {ngo.categories.some(c => c.name === "Education") ? "📚" : "🤝"}
                </div>

                {ngo.verified && (
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                        Verified
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-500 transition-colors">
                    {ngo.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                    {ngo.description}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {ngo.categories.map((cate) => (
                        <span
                            key={cate.id}
                            className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide"
                        >
                            {cate.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    📍 {ngo.city || "Cambodia"}
                </span>
                <Link
                    to={`/profile/${ngo.id}`}
                    className="bg-[#93c5fd] hover:bg-blue-400 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-100/50 hover:shadow-blue-200"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}

export default NGOCard;