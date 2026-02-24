/**
 * Software Framework: React (Frontend)
 * Description:
 *      The primary hero section for the home page, containing a large 
 *      call-to-action banner and a global search input.
 * 
 */

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Home page Hero section component.
 * 
 * @param search Current global search value.
 * @param setSearch Setter for search value.
 * @param onSearch Callback for primary search action.
 * @param onBrowseAll Callback to navigate to browse all.
 */
function HeroSection({ search, setSearch, onSearch, onBrowseAll }) {
    return (
        <section className="relative overflow-hidden card">
            <div className="h-[380px] md:h-[440px] w-full">
                <img
                    src="https://www.pse.ngo/sites/default/files/images/paragraphs/img2553.jpg"
                    alt="Donation"
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10" />

            <div className="absolute inset-0 flex items-end">
                <div className="p-6 md:p-10 w-full">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold tracking-widest text-white/85 uppercase">
                            Donation Directory
                        </p>

                        <h1 className="mt-2 text-3xl md:text-5xl font-semibold text-white">
                            Find verified NGOs and donate safely
                        </h1>

                        <div className="mt-5 flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search NGOs by name or description..."
                                    className="input-clean"
                                />
                            </div>
                            <button onClick={onSearch} className="btn-primary">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
