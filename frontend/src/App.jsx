import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewSession from './pages/NewSession';
import SessionView from './pages/SessionView';

const AppRoutes = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-background text-gray-100 font-sans">
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/history" element={<Dashboard />} />
                    <Route path="/new" element={<NewSession />} />
                    <Route path="/session/:id" element={<SessionView />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
