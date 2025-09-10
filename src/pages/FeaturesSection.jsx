import React from 'react';
import {
  Sparkles,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Camera,
  ArrowLeft,
  Download,
  SearchCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'AI-Powered Reviews',
    description: 'Harnesses AI to generate insightful and accurate product reviews instantly.',
    icon: <Sparkles className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'Image-Based Analysis',
    description: 'Upload product images and get a detailed review of design, features, and quality.',
    icon: <Camera className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'Pros & Cons Summary',
    description: 'Breaks down each product’s strengths and weaknesses clearly and concisely.',
    icon: <Shield className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'Performance Insights',
    description: 'Evaluates durability, efficiency, and real-world usage metrics.',
    icon: <Zap className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'Market Comparison',
    description: 'Compares pricing and specs with similar products in the market.',
    icon: <TrendingUp className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'Quality Scoring',
    description: 'Assigns an AI-generated quality score based on build and features.',
    icon: <Star className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'AI Product Comparison',
    description: 'Compares two products by name or image and provides a smart AI-powered recommendation.',
    icon: <Sparkles className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'Smart Specification Finder',
    description: 'Fetches 10–12 key technical specs for any product using AI in a concise format.',
    icon: <Download className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: 'Verified Insights',
    description: 'Delivers accurate and relevant product insights using Advance Ai trusted language model.',
    icon: <SearchCheck className="w-6 h-6 text-yellow-300" />,
  }
];

const FeaturesSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-sky-400 via-purple-600 to-purple-900 text-white min-h-screen py-20 px-6 md:px-12 relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Features Content */}
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Why Choose <span className="text-yellow-300">PingReview.Ai</span>?
        </h2>
        <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
          Unlock deep insights into any product with image-based AI analysis powered by Advance Ai Model.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 text-left hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div>{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-white/80 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
