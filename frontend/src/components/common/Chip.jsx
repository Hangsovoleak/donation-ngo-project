/**
 * Software Framework: React (Frontend)
 * Description:
 *      Small UI chip component for displaying categories, tags, or statuses.
 * 
 */

/*------------------------------------------------------------------------------
                             COMPONENT FUNCTIONS
------------------------------------------------------------------------------*/

/**
 * @brief Simple Chip component.
 * 
 * @param children Chip label text.
 */
function Chip({ children }) {
    return (
        <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {children}
        </span>
    );
}

export default Chip;
