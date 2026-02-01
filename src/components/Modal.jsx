function Modal({ open, title, onClose, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/30 px-4">
            <div className="relative w-full max-w-md max-h-[80vh]">
                <div className="relative bg-white border border-brand-soft rounded-2xl shadow-lg p-4 overflow-auto max-h-[80vh]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-brand-ink">{title}</h2>
                            <p className="text-xs text-brand-ink/60">
                                {title === "Edit NGO" ? "Update details" : "Enter organization details"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-base text-brand-ink/60 hover:bg-brand-soft transition-colors"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
