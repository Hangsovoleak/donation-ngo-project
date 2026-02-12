// Modal: reusable overlay dialog for admin forms.
function Modal({ open, title, onClose, children }) {
    if (!open) return null;

    return (
        <div className="fixed h-full inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4">
            <div className="relative w-full max-w-md max-h-[80vh]"> 
                <div className="relative card p-4 overflow-auto max-h-[80vh]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
                            <p className="text-xs text-slate-500">
                                {title === "Edit NGO" ? "Update details" : "Enter organization details"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-900 font-semibold"
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
