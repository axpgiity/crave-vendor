import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const vendorImages = [
  "https://mnhisdyeqfhcjqfesdjs.supabase.co/storage/v1/object/public/vendor-images/Vendors/Kiit/Camp15.jpg",
  "https://mnhisdyeqfhcjqfesdjs.supabase.co/storage/v1/object/public/vendor-images/Vendors/Kiit/Camp3.jpg",
  "https://mnhisdyeqfhcjqfesdjs.supabase.co/storage/v1/object/public/vendor-images/Vendors/Kiit/HighRaidus.jpg",
  "https://mnhisdyeqfhcjqfesdjs.supabase.co/storage/v1/object/public/vendor-images/Vendors/Kiit/KiimsEmergencyFC.jpg",
  "https://mnhisdyeqfhcjqfesdjs.supabase.co/storage/v1/object/public/vendor-images/Vendors/Kiit/QC4.jpg",
];

const features = [
  {
    title: "Preorder System",
    desc: "Order in advance and skip the waiting lines during peak hours.",
  },
  {
    title: "Fast Delivery",
    desc: "Hot and fresh meals delivered quickly across campus zones.",
  },
  {
    title: "Grocery Access",
    desc: "Get groceries and essentials from nearby vendors within minutes.",
  },
  {
    title: "Student Exclusive",
    desc: "Only verified university students can access our platform.",
  },
  {
    title: "Real-Time Tracking",
    desc: "Track your order from kitchen to pickup in real time.",
  },
  {
    title: "Secure Payments",
    desc: "Safe checkout powered by Razorpay with multiple payment options.",
  },
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const vendorSectionRef = useRef<HTMLDivElement>(null);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vendorImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVendorClick = () => {
    vendorSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoginClick = () => navigate("/auth");

  const handleSignupClick = () => {
    alert(
      "You must be part of the university to sign up as a vendor.\nContact us at 2205966@kiit.ac.in to join FoodCourt."
    );
  };

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-8 md:px-16 py-5 shadow-sm bg-white fixed w-full top-0 z-50">
        <div className="text-3xl font-extrabold text-orange-500 tracking-tight">
          FoodCourt
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleLoginClick}
            className="border border-orange-500 text-orange-500 px-5 py-2 rounded-full font-medium hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={handleSignupClick}
            className="bg-orange-500 text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-all duration-300"
          >
            Contact Us
          </button>
        </div>
      </header>

      {/* Hero with full-screen slideshow */}
      <section className="relative h-screen w-full">
        {vendorImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slide ${idx}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Dark gradient overlay to improve text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

        {/* Hero text overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Not Just Another Delivery App,
              <br />
              <span className="text-orange-400">
                We’re Redefining Campus Food
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-10 text-gray-200">
              FoodCourt brings meals, groceries, and convenience to your
              university — preorder, track, and enjoy quick access to campus
              food systems.
            </p>
            <button
              onClick={handleVendorClick}
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-orange-600 transition-all duration-300"
            >
              Explore Vendors
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            About Us
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We’re not just another fast-food delivery app. FoodCourt is an
            exclusive ecosystem for university students — offering preorders,
            live tracking, and instant access to food and groceries within your
            campus.
            <br />
            <br />
            Our mission is to simplify how students access meals and essentials
            while empowering local campus vendors.
            <br />
            <br />
            We’re launching soon at{" "}
            <span className="font-bold text-orange-600">KIIT University</span> —
            and this is just the beginning.
          </p>
        </div>
      </section>

      {/* Vendor Gallery */}
      <section
        ref={vendorSectionRef}
        className="py-20 bg-white text-center px-8"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
          Campus Vendors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vendorImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Vendor ${i + 1}`}
              className="w-full h-64 object-cover rounded-2xl shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300"
            />
          ))}
        </div>
      </section>

      {/* App Section */}
      <section className="py-20 bg-gradient-to-br from-orange-100 to-orange-50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            The FoodCourt App
          </h2>
          <p className="text-gray-700 mb-8 text-lg">
            Coming soon on your phones — all through one seamless student app.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-14 hover:scale-105 transition-transform"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-14 hover:scale-105 transition-transform"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8 md:px-16 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-10 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-10 text-gray-300 text-sm">
        <p className="text-lg font-semibold text-white">FoodCourt</p>
        <p className="mt-2 max-w-xl mx-auto text-gray-400">
          Revolutionizing campus dining — preorder, track, and enjoy.
          Exclusively for students.
        </p>
        <div className="mt-6 text-xs text-gray-500">
          © 2025 FoodCourt. All rights reserved. | Powered by Razorpay for
          secure payments
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
