import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthToggle from "./components/AuthToggle";
import UniversityBadge from "./components/UniversityBadge";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import SocialAuth from "./components/SocialAuth";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginRegister() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Redirect if already logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/discovery-feed" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        {/* University Badge */}
        <UniversityBadge />

        {/* Welcome Message */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Join UniMesh"}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? "Sign in to continue your journey" : "Where every student story begins"
            }
          </p>
        </div>

        {/* Auth Toggle */}
        <AuthToggle isLogin={isLogin} onToggle={setIsLogin} activeMode={isLogin ? 'login' : 'register'} onModeChange={(mode) => setIsLogin(mode === 'login')} />

        {/* Auth Form */}
        <div className="mt-8">
          {isLogin ? (
            <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
          ) : (
            <RegisterForm />
          )}
        </div>

        {/* Social Authentication */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <SocialAuth onSuccess={(userData) => console.log('Social auth success:', userData)} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            By continuing, you agree to our{" "}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
}