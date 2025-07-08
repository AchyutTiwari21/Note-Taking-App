import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import DashboardPage from './pages/DashboardPage';
import NoteDetailPage from './pages/NoteDetailPage';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/note/:id" element={<NoteDetailPage />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;