import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import AuthPage from './pages/Auth';
import LearnMore from './pages/LearnMore';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import VerifyData from './pages/VerifyData';
import Settings from './pages/Settings';
import ItemDetails from './pages/ItemDetails';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Layout component that shows Navbar except on specific pages
function Layout() {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/auth', '/learn-more'];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 w-full h-full flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/learn-more" element={<LearnMore />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto"><Dashboard /></div></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto"><Upload /></div></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto"><VerifyData /></div></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto"><Settings /></div></ProtectedRoute>} />
          <Route path="/item/:id" element={<ProtectedRoute><div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto"><ItemDetails /></div></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </Router>
  );
}

export default App;
