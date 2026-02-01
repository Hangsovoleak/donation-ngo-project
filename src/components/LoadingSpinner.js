function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            {/* Pulsing Icon Container */}
            <div className="relative flex items-center justify-center">
                {/* Outer Ring Animation */}
                <div className="absolute animate-ping h-16 w-16 rounded-full bg-blue-100 opacity-75"></div>
                
                {/* Inner Icon Box */}
                <div className="relative bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-[#93c5fd] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-[#93c5fd] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-[#93c5fd] rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>

            {/* Loading Text */}
            <div className="text-center">
                <p className="text-slate-800 font-bold text-lg tracking-tight">Syncing Data</p>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Please wait a moment</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;