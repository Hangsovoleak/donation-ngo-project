import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FileterSidebar';
import NGOList from '../components/NGOlist';
import { ngoService } from '../services/ngoService';

function BrowsePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ category: [], location: '', beneficiaries: [] });
    const [ngos, setNgos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                setIsLoading(true);
                const data = await ngoService.getAllNGOs({
                    search: searchQuery,
                    city: filters.location,
                    category: filters.category,
                    beneficiaries: filters.beneficiaries
                });
                setNgos(data);
            } catch (error) {
                console.error('Error fetching NGOs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNGOs();
    }, [searchQuery, filters]);

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
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                                <p className="mt-4 text-slate-400 font-medium">Loading organizations...</p>
                            </div>
                        ) : (
                            <NGOList ngos={ngos} />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default BrowsePage;