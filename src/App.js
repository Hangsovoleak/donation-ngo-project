<<<<<<< HEAD
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Detail from './pages/Details';
import Admin from './pages/Admin';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/browse" element={<Browse />}/>
        <Route path="/ngos/:id" element={<Detail />}/>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />}/>
      </Routes>
    </Layout>
=======
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
>>>>>>> 403bbf9e8d9e1e8313a643c1479f5c0bb2f245e5
  );
}

export default App;
