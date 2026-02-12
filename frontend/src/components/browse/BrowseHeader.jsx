// Browse page component: Header with GIF banner
function BrowseHeader() {
    return (
        <div className="p-6 md:p-2 text-center">
            <img
                className="w-full h-96 object-cover rounded-xl"
                src="https://i.pinimg.com/originals/ae/7b/2e/ae7b2e1626d7f7c81fa51fbc4ebf2413.gif"
                alt="Browse NGOs"
            />
        </div>
    );
}

export default BrowseHeader;
