// Common UI component: Chip for displaying tags
// using it with NGOCard.jsx control the display of categories and beneficiaries
function Chip({ children }) {
    return (
        <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {children}
        </span>
    );
}

export default Chip;
