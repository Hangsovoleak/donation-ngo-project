import { useState, useEffect } from 'react'; // Added useEffect
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FileterSidebar';
import NGOList from '../components/NGOlist';

function BrowsePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ category: [], location: '', beneficiaries: [] });
    
    // setIsLoading is now used below!
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a 800ms delay to show off your clean loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f7f6]">
            <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-80 shrink-0">
                        <FilterSidebar filters={filters} onChange={setFilters} />
                    </aside>

                    <section className="flex-1">
                        <div className="w-full max-w-lg mb-8">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                {/* Using the blue from your reference image */}
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                                <p className="mt-4 text-slate-400 font-medium">Loading organizations...</p>
                            </div>
                        ) : (
                            <NGOList />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default BrowsePage;