import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="card w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                    <p className="mt-2 text-slate-400">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <input
                                type="email"
                                required
                                className="input-field mt-1"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                required
                                className="input-field mt-1"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
                    </button>
                </form>

                <div className="text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary hover:text-blue-400">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
