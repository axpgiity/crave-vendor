import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import { AuthForm } from "./components/Forms/AuthForm";

import { Summary } from "./pages/Summary";
import { OrdersHistory } from "./pages/OrdersHistory";
import { MenuPage } from "./pages/MenuPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignupForm } from "./components/Forms/SignUpForm";
import HomePage from "./pages/HomePage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Summary />} />
            <Route path="register" element={<SignupForm />} />
            <Route path="history" element={<OrdersHistory />} />
            {/* <Route path="menu" element={<MenuPage />} /> */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
