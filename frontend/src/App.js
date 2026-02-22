import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Detail from './pages/Details';
import Admin from './pages/Admin';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      {/* Routes */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* Browse */}
        <Route path="/browse" element={<Browse />} />
        {/* Detail */}
        <Route path="/ngos/:id" element={<Detail />} />
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
