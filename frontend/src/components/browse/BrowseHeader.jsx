// Browse page component: Header with PNG banner
// using it in Browse.jsx to display PNG banner
function BrowseHeader() {
    return (
        <div className="p-6 md:p-2 flex justify-center5">
            <img
                className="w-full max-h-[400px] object-cover rounded-xl max-w-[1400px] bg-slate-500/95"
                src="https://our-future-agenda.shorthandstories.com/pactdecoded/pact-decoded/chapter-4/assets/pBzXlDA6Jo/3-2560x1440.png"
                alt="Browse NGOs"
            />
        </div>
    );
}

export default BrowseHeader;
