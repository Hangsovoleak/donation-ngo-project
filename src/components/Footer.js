function Footer() {
    return (
        <footer className="mt-20 pb-12 px-8">
            <div className="max-w-[1440px] mx-auto">
                {/* Subtle Divider */}
                <div className="h-[1px] w-full bg-slate-100 mb-8"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🍀</span>
                        <p className="text-sm font-bold text-slate-800 tracking-tight">
                            Donation Discovery
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                            © 2026 • Rock Rak Team
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors">Privacy</a>
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors">Terms</a>
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;