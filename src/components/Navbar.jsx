import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Shield, TrendingUp, ArrowRight, Sparkles, Search, MessageSquare, BarChart3, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

// Responsive Navbar component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleProfileClick = () => {
    // Navigate to profile page or show dropdown
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const renderProfileLetter = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="w-full max-w-6xl mx-auto px-6 py-4 flex justify-between items-center relative">
      <motion.div
        className="text-2xl font-bold text-white z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        PingReview.AI
      </motion.div>

      {/* Desktop Menu */}
      <motion.div
        className="hidden md:flex space-x-8 text-white/90 items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
         <NavLink  to="/vs-comparision"  className="hover:text-amber-300 transition-colors duration-300 font-medium">Vs Comparison</NavLink >
        <NavLink   to="/product-specification" className="hover:text-amber-300 transition-colors duration-300 font-medium">Product specification</NavLink >
        <NavLink  to="/features" className="hover:text-amber-300 transition-colors duration-300 font-medium">Features</NavLink >
        <NavLink  to="/about" className="hover:text-amber-300 transition-colors duration-300 font-medium">About</NavLink >
        <NavLink  to="/contact" className="hover:text-amber-300 transition-colors duration-300 font-medium">Contact</NavLink >

        {/* Desktop Auth Button - Conditional Rendering */}
        {!user ? (
          <NavLink  to="/login" className="hover:text-amber-300 transition-colors duration-300 font-medium bg-slate-800 px-2 py-1 rounded-xl">Sign In</NavLink >
        ) : (
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex cursor-pointer items-center gap-2 hover:text-amber-300 transition-colors duration-300 font-medium bg-slate-800 px-2 py-1 rounded-xl"
            >
              <div className="bg-yellow-400 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm"
              onClick={() => (window.location.href = '/login')}
              >
                {renderProfileLetter(user.email)}
              </div>
              <span
               onClick={() => (window.location.href = '/login')}
              >Profile</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden text-white z-50 p-2"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl z-50 md:hidden min-w-[200px]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col py-4">
              <NavLink
                to="/product-specification"
                className="px-6 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Product Specification
              </NavLink>
              <NavLink
                to="/vs-comparision"
                className="px-6 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Vs Comparision
              </NavLink>
              <NavLink
                to="/features"
                className="px-6 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Features
              </NavLink>
              <NavLink
                to="/about"
                className="px-6 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className="px-6 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </NavLink>

              {/* Mobile Auth Button - Conditional Rendering */}
              {!user ? (
                <NavLink
                  to="/login"
                  className="px-6 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 transition-all duration-300 font-medium bg-slate-800 rounded-xl mx-2"
                  onClick={() => setIsOpen(false)}
                >
                  Sign-in
                </NavLink>
              ) : (
                <div className="px-2 space-y-2"
                 onClick={() => (window.location.href = '/login')}
                >
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-3 text-white/90 hover:text-amber-300 hover:bg-white/10 transition-all duration-300 font-medium bg-slate-800 rounded-xl flex items-center gap-3"
                  >
                    <div className="bg-yellow-400 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {renderProfileLetter(user.email)}
                    </div>
                    <span
                     onClick={() => (window.location.href = '/login')}
                    >Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-white/90 hover:text-red-300 hover:bg-white/10 transition-all duration-300 font-medium bg-red-600 rounded-xl"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;