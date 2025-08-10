import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { authService } from "../../../utils/authService";

export default function LoginForm({ onForgotPassword }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic validation
    if (!formData?.email || !formData?.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const { error: signInError } = await authService?.signIn(formData?.email, formData?.password);
      
      if (signInError) {
        if (signInError?.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (signInError?.message?.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else if (signInError?.message?.includes('Failed to fetch') || 
                   signInError?.message?.includes('AuthRetryableFetchError')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
        } else {
          setError(signInError?.message || 'Failed to sign in. Please try again.');
        }
        return;
      }

      // Success - AuthContext will handle the redirect
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Quick demo login (for development/testing)
  const handleDemoLogin = async () => {
    setFormData({
      email: "alex.chen@university.edu",
      password: "student123"
    });
    
    // Auto-submit with demo credentials
    setError(null);
    setIsLoading(true);
    
    try {
      const { error: signInError } = await authService?.signIn("alex.chen@university.edu", "student123");
      
      if (signInError) {
        setError(signInError?.message || 'Demo login failed. Please try manual login.');
        return;
      }
    } catch (err) {
      setError('Demo login failed. Please try manual login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            {error}
            {error?.includes('Supabase project may be paused') && (
              <div className="mt-2">
                <p className="font-medium">Quick fix:</p>
                <ol className="list-decimal list-inside mt-1 text-xs">
                  <li>Go to your Supabase dashboard</li>
                  <li>Find your project and click "Resume"</li>
                  <li>Wait a moment and try signing in again</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Demo Login Button - Remove in production */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm mb-2">For demo purposes, click below to login with sample data:</p>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm underline disabled:opacity-50"
        >
          Login as Demo User (Alex Chen)
        </button>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="email"
            name="email"
            type="email"
            value={formData?.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@university.edu"
            disabled={isLoading}
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData?.password}
            onChange={handleInputChange}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}