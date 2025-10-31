import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Package, LogOut, User, Pill, Truck, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/Logo.png";

export function Layout() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Summary", icon: Package },
    { path: "/history", label: "History", icon: Pill },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-200">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex justify-center">
                  <img
                    src={Logo}
                    alt="Logo?"
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <Link
                  to="/"
                  className="ml-3 text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent"
                >
                  Crave
                </Link>
              </div>

              {/*Large Screen */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navLinks.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`${
                      location.pathname === path
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={signOut}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="sm:hidden inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/*Mobile Screen */}
        {isNavOpen && (
          <div className="sm:hidden px-4 pb-4">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`${
                  location.pathname === path
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-orange-600 hover:border-orange-300"
                } block px-3 py-2 border-b-2 text-sm font-medium transition-colors`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-16">
        <Outlet />
      </main>
    </div>
  );
}
