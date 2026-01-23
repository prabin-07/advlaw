import { useState } from "react";
import lawLogo from "../assets/law-logo.png";

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Simulate authentication
    console.log(isSignUp ? "Signing up..." : "Signing in...", formData);
    onLogin(formData.email);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img
            src={lawLogo}
            alt="Law Logo"
            className="h-20 w-20 mx-auto mb-4 hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Advocate AI</h1>
          <p className="text-gray-300">Your AI-powered legal assistant</p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-300 text-center">
              {isSignUp
                ? "Sign up to get started with Advocate AI"
                : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {isSignUp && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-blue-400 hover:text-blue-300 font-medium focus:outline-none focus:underline transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.662l-5.214-6.817-5.96 6.817H1.684l7.73-8.84L1.25 2.25h6.832l4.713 6.231 5.449-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
              </svg>
              <span className="ml-2"></span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          {isSignUp ? (
            <p>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          ) : 
            <p>
            Advocate AI.
          </p>
          }
        </div>
      </div>
    </div>
  );
}

export default Login;