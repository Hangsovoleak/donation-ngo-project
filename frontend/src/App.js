/**
 * Software Framework: React (Frontend)
 * Description:
 *      Root application component defining the global layout, 
 *      routing table, and core navigation structure.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Page components
import Home from './pages/Home';
import Browse from './pages/Browse';
import Detail from './pages/Details';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';

/*------------------------------------------------------------------------------
                               MAIN COMPONENT
------------------------------------------------------------------------------*/

/**
 * @brief Application entry component.
 */
function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/ngos/:id" element={<Detail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
