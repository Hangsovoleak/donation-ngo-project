import NGOCard from './NGOcard';

function NGOList({ ngos = [] }) {
    return (
        <section className="mt-8">
            {/* Section Header to match the reference "Recent Sales" */}
            <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-xl font-bold text-slate-800">Organizations</h3>
                <button className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                    See all
                </button>
            </div>

            {ngos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ngos.map((ngo) => (
                        <NGOCard key={ngo.id} ngo={ngo} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-slate-200">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-slate-400 font-medium">No organizations found at this time.</p>
                </div>
            )}
        </section>
    );
}

export default NGOList;