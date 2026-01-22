import { Link } from 'react-router-dom';
import ProfilePage from '../assets/profile.jpg';

function Header() {
    return (
        <header className='bg-[#f4f7f6]/80 backdrop-blur-md sticky top-0 z-40'>
            <nav className='max-w-[1440px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between'>
                
                {/* Logo & Brand */}
                <Link to="/browse" className="flex items-center gap-4 group">
                    <div className='w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform'>
                        
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Greetings!</h1>
                        <p className="text-xs text-slate-400 font-medium">Start your day with purpose</p>
                    </div>
                </Link>

                {/* Search Bar Placeholder (Optional - if you want it in the header) */}
                <div className="hidden md:block flex-1 max-w-md mx-10">
                    {/* You can drop your SearchBar component here for the exact look in the image */}
                </div>

                {/* Actions / Profile */}
                <div className='flex items-center gap-4'>
                    <Link 
                        to='/login' 
                        className='bg-black text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2'
                    >
                        <span>My Account</span>
                    </Link>
                    
                    {/* User Avatar - Matches the top-right of your reference */}
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden hidden sm:block">
                        <img 
                            src={ProfilePage}
                            alt="User" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;