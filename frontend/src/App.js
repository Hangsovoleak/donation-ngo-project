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
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/browse" element={<Browse />}/>
        <Route path="/ngos/:id" element={<Detail />}/>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
