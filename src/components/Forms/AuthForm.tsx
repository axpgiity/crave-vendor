import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Mail, Lock, Package } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.FormEvent,
    type: "signin" | "signup"
  ) => {
    e.preventDefault();
    if (type == "signin") {
      const success = await signIn(email, password);
      if (success) {
        navigate("/");
      }
    } else {
      //const success = await signUp(email, password);
      //if (success) {
      navigate("/register");
      //}
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 via-white to-medical-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src="/src/assets/Logo.png"
              alt="Logo"
              className="h-20 w-20 rounded-full"
            />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Welcome to Crave
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your FoodCourt's Orders efficiently
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg border border-medical-100">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-medical-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-medical-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-accent-coral text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              onClick={(e) => handleSubmit(e, "signin")}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-orange-200 text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            <button
              type="submit"
              onClick={(e) => handleSubmit(e, "signup")}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-oranfe-200 text-sm font-medium rounded-md text-medical-700 bg-orange-50 hover:bg-medical-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
