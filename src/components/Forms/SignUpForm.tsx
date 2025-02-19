import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");

  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await signUp(email, password);

      if (success) {
        // Save additional shop details to the database
        const { error: dbError } = await supabase.from("vendors").insert({
          user_id: user.id, // Reference the authenticated user's ID
          name: shopName,
        });

        if (dbError) {
          throw dbError;
        }

        toast.success("Registration successful!");
        console.log("User and shop details saved successfully!");
      }
    } catch (error: any) {
      console.error("Error during signup:", error.message);
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 via-white to-medical-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="flex justify-center">
          <img
            src="/src/assets/Logo.png"
            alt="Logo"
            className="h-20 w-20 rounded-full"
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create an Account
        </h2>
        <form
          onSubmit={handleSignup}
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg border border-medical-100"
        >
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm"
            />
            <input
              type="text"
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
