import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import BrowsePage from './pages/BrowsePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <div className='min-h-screen bg-slate-100 text-slate-800 font-sans'>
        <Header />
        <Routes>
          <Route path='/' element={<BrowsePage />} />
          <Route path='/browse' element={<BrowsePage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
