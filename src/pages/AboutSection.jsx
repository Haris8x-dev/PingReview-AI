import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
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

      {/* About Content */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-10 h-10 text-yellow-300" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          About <span className="text-yellow-300">pingreview.Ai</span>
        </h2>
        <p className="text-white/80 text-lg leading-relaxed mb-6">
          <span className="text-yellow-300 font-semibold">pingreview.Ai</span> is a smart product reviewing platform powered by Advance AI Technology.
          It allows users to upload product images or enter product names to receive detailed, AI-generated reviews — including build quality, performance analysis, market comparisons, and pros & cons.
        </p>
        <p className="text-white/80 text-lg leading-relaxed mb-6">
          Built by Haris, an 18-year-old college student passionate about artificial intelligence, pingreview.Ai delivers fast, reliable, and unbiased product assessments to help you make smarter buying decisions.
        </p>
        <p className="text-white/70 text-base">
          Whether you're a shopper, researcher, or product tester — pingreview.Ai is here to help you understand products better, faster, and smarter.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
