import { useState } from "react";
import lawLogo from "./assets/law-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };
    return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full bg-black rounded-lg shadow-lg p-8">
        <div className="mb-6 text-center">
          <img 
            src={lawLogo} 
            alt="Law Logo" 
            className="h-24 w-24 mx-auto mb-4 hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Login to Advocate AI
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
    );  
}
