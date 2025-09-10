import { Star, Zap, Shield, TrendingUp, ArrowRight, Sparkles, Search, MessageSquare, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();


  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Get instant, comprehensive product reviews using advanced AI technology"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Unbiased Reviews",
      description: "Objective analysis based on real data, specifications, and user feedback"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Insights",
      description: "Compare products with market trends and competitive analysis"
    }
  ];

  const stats = [
    { number: "10K+", label: "Products Reviewed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "AI Availability" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-sky-400 via-purple-600 to-purple-900 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className='relative z-10 flex justify-start items-center flex-col pt-10 gap-12'>
        <Navbar />

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6'
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            Welcome to <span className='text-amber-300 relative'>
              PingReview.AI
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-6 sm:w-8 sm:h-8 text-amber-300" />
              </motion.div>
            </span>
          </motion.h1>

          <motion.p
            className='text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Transform your product research with AI-powered reviews. Get comprehensive, unbiased analysis in seconds using Advance AI Powered technology.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
          <button
  onClick={() => navigate('/chat')} // navigate to /chat
  className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-2 group cursor-pointer"
>
  Start Reviewing Now
  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
</button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto px-6 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-amber-300 mb-2">{stat.number}</div>
              <div className="text-white/80 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Why Choose <span className="text-amber-300">PingReview.AI?</span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            Experience the future of product evaluation with our intelligent review system
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border transition-all duration-500 ${currentFeature === index
                  ? 'border-amber-300 bg-white/20 scale-105'
                  : 'border-white/20 hover:border-white/40'
                  }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6 + index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className={`text-amber-300 mb-4 transition-all duration-300 ${currentFeature === index ? 'scale-110' : ''
                  }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            How It <span className="text-amber-300">Works</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Search />, title: "Search Product", desc: "Enter any product name or URL" },
              { icon: <MessageSquare />, title: "AI Analysis", desc: "Our  Advance AI Powered Model analyzes the product" },
              { icon: <BarChart3 />, title: "Get Insights", desc: "Receive comprehensive review report" }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 2.2 + index * 0.3 }}
              >
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/80">{step.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-amber-300 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-8 sm:p-12 mx-6 max-w-4xl text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-black/80 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of smart shoppers who trust PingReview.AI for their product decisions
          </p>
          <button
          onClick={() => navigate('/chat')} // navigate to chat
          className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl cursor-pointer">
            Try PingReview.AI Free
          </button>
        </motion.div>

        {/* Footer */}
        <footer className="w-full bg-black/20 backdrop-blur-md border-t border-white/10 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-white/60">
              © 2025 PingReview.AI. Powered by Advance Ai Models.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default Home;