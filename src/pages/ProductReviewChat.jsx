import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Upload,
  Download,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  Star,
  TrendingUp,
  Shield,
  Zap,
  X,
  Copy,
  Check,
  Loader,
  Camera
} from 'lucide-react';

const ProductReviewChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!inputText.trim() && !uploadedImage && messages.length === 0) {
      setShowPrompts(true);
    }
  }, [inputText, uploadedImage, messages]);


  // Pre-made prompts for quick interaction
  const quickPrompts = [
    {
      icon: <Star className="w-5 h-5" />,
      title: "Product Quality Analysis",
      prompt: "Analyze the quality and build materials of this product in detail."
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Market Comparison",
      prompt: "Compare this product with similar alternatives in the market and provide price analysis."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Pros & Cons Review",
      prompt: "List detailed pros and cons of this product based on user reviews and specifications."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Performance Review",
      prompt: "Evaluate the performance, durability, and value for money of this product."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert image to base64 for Gemini API
  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Call Gemini API for product analysis
  const analyzeWithGemini = async (imageData, prompt) => {
    setIsLoading(true);

    try {
      let requestBody;
      const contents = [{ parts: [] }];

      // Normalize imageData → raw base64
      let base64Image = null;
      if (imageData) {
        base64Image = (typeof imageData === "string" && imageData.startsWith("data:"))
          ? imageData.split(",")[1]
          : imageData;
      }

      // If image exists → add inline_data part
      if (base64Image) {
        contents[0].parts.push({
          inline_data: {
            mime_type: "image/jpeg",
            data: base64Image
          }
        });
      }

      // Decide which text instruction to send
      const instructionText = (prompt && prompt.trim())
        ? prompt.trim()
        : (base64Image
          ? `You're a product review expert. Analyze the product image and generate a review covering: quality, features, pros & cons, and market comparison. Keep each section short and informative — around 4–5 lines each, using concise bullet points. Avoid fluff.`
          : "");

      if (instructionText) {
        contents[0].parts.push({ text: instructionText });
      }

      // Pick correct model
      const modelToUse = base64Image ? "gemini-2.5-flash" : "gemini-1.5-flash";

      requestBody = { model: modelToUse, contents };

      // 🔍 Debug log
      console.log("Gemini request:", { model: modelToUse, parts: contents[0].parts });

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.candidates && data.candidates[0]) {
        const analysisText = data.candidates[0].content.parts[0].text;

        if (base64Image) {
          setLastAnalysis({
            productName: "Analyzed Product",
            analysisText
          });
        }

        return analysisText;
      } else {
        console.error("API Response:", data);
        throw new Error(data.error?.message || "No response from AI");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setIsLoading(false);
      throw error;
    }
  };


  const filterCustomResponse = (text) => {
    const lower = text.toLowerCase();

    const filters = [
      {
        keywords: [
          "who created you", "who created u", "who built you", "who built u", "who made you", "who made u", "who is your creator",
          "your developer", "who programmed you", "who designed you", "who developed you", "who is your owner", "who is your developer", "to whom you belong", "whose property are u"
        ],
        response: "I am built by Haris, a college student who is 18 years old and passionate about building AI applications."
      },
      {
        keywords: [
          "how old are you", "what's your age", "tell me your age"
        ],
        response: "I'm 18 years old, just like my creator Haris!"
      },
      {
        keywords: [
          "what's your name", "do you have a name", "your name please", "what is your name", "your identity", "what is your identity"
        ],
        response: "I'm the AI Product Reviewer, built by Haris."
      },
      {
        keywords: [
          "what do you do", "what's your purpose", "what are you for", "what is your job",
          "how do you help", "your work", "why do you exist"
        ],
        response: "My work is to provide detailed product reviews by analyzing images and generating insights from the internet."
      },
      {
        keywords: [
          "what's your education", "what is your qualification", "are you in school or college"
        ],
        response: "I'm a product of Haris's creativity — he's a college student with a passion for AI development."
      },
      {
        keywords: [
          "what are you passionate about", "what's your passion", "what drives you"
        ],
        response: "My creator Haris is passionate about building AI applications — that passion powers everything I do."
      },
      {
        keywords: [
          "can you help me", "how can you help", "what can you do"
        ],
        response: "I'm trained to generate high-quality product reviews from image inputs and internet knowledge."
      }
    ];

    for (const filter of filters) {
      for (const keyword of filter.keywords) {
        if (lower.includes(keyword)) {
          return filter.response;
        }
      }
    }

    return null;
  };

  const handleSendMessage = async (text = inputText) => {
    if ((!text.trim() && !uploadedImage) || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      image: uploadedImage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowPrompts(false);

    // 🔍 Custom Filter Logic
    const filteredResponse = filterCustomResponse(text);
    if (filteredResponse) {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: filteredResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setUploadedImage(null);
      return;
    }
    try {
      let imageBase64 = null;
      if (uploadedImage) {
        // Convert data URL to base64
        imageBase64 = uploadedImage.split(',')[1];
      }

      const response = await analyzeWithGemini(imageBase64, text);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Clear uploaded image after analysis
      setUploadedImage(null);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I encountered an error analyzing your request. Please make sure you have a stable internet connection and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPrompt = (prompt) => {
    if (uploadedImage) {
      handleSendMessage(prompt);
    } else {
      setInputText(prompt);
    }
  };

  const generatePDF = () => {
    if (!lastAnalysis) return;

    // Create HTML content for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Product Review Report</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 40px;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #007bff;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #007bff;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #666;
                margin: 5px 0;
                font-size: 14px;
            }
            .section {
                margin: 25px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #007bff;
            }
            .section h2 {
                color: #007bff;
                margin-top: 0;
                font-size: 20px;
            }
            .analysis-content {
                white-space: pre-wrap;
                font-size: 14px;
                line-height: 1.7;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #eee;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔍 Product Review Report</h1>
            <p>Generated by AI Product Reviewer</p>
            <p>Analysis Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
            <h2>📊 Product Analysis</h2>
            <div class="analysis-content">${lastAnalysis.analysisText || 'Analysis not available'}</div>
        </div>

        <div class="footer">
            <p>Report generated by AI Product Reviewer</p>
            <p>Powered by Advanced AI Technology</p>
        </div>
    </body>
    </html>
    `;

    // Create and download PDF-like HTML file
    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${lastAnalysis.productName.replace(/\s+/g, '_')}_Review_Report.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Also create a print-friendly version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-purple-600 to-purple-900 relative flex flex-col">
      {/* Background Effects */}
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header - Fixed */}
      <motion.header
        className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4 z-20 flex-shrink-0 fixed w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="text-white hover:text-amber-300 transition-colors"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-amber-300" />
              <h1 className="text-2xl font-bold text-white">AI Product Reviewer</h1>
            </div>
          </div>

          {lastAnalysis && (
            <motion.button
              onClick={generatePDF}
              className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Download Report
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Main Content - Scrollable Area */}
      <div className="flex-1 relative z-10 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full p-4">
            {/* Messages Container */}
            <div className="space-y-4 pb-4">
              {messages.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <MessageSquare className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Start Your Product Analysis</h2>
                    <p className="text-white/80">Upload a product image or select a quick prompt to begin</p>
                  </div>
                </motion.div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message.type === 'user' ? 'bg-amber-500' : 'bg-white/10 backdrop-blur-md'} rounded-2xl p-4 border ${message.type === 'user' ? 'border-amber-400' : 'border-white/20'}`}>
                    {message.image && (
                      <div className="mb-3">
                        <img src={message.image} alt="Uploaded product" className="rounded-lg max-w-sm max-h-64 object-cover" />
                      </div>
                    )}
                    <div className={`${message.type === 'user' ? 'text-black' : 'text-white'} whitespace-pre-wrap`}>
                      {message.content}
                    </div>
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-white/60 hover:text-white transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <span className="text-xs text-white/60">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Loader className="w-5 h-5 text-amber-300 animate-spin" />
                      <span className="text-white">
                        {uploadedImage ? 'Analyzing your product...' : 'Thinking...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Prompts - Now positioned absolutely to avoid layout shifts */}
              <AnimatePresence>
                {showPrompts && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4"
                  >
                    <h3 className="text-white font-medium mb-3">Quick Analysis Options:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quickPrompts.map((prompt, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleQuickPrompt(prompt.prompt)}
                          className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 transition-all text-left group"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-amber-300 group-hover:scale-110 transition-transform">
                              {prompt.icon}
                            </div>
                            <div>
                              <div className="text-white font-medium">{prompt.title}</div>
                              <div className="text-white/70 text-sm">{prompt.prompt}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-4">
              {uploadedImage && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="rounded-lg max-h-32 max-w-48 object-cover"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-colors flex-shrink-0"
                >
                  <Camera className="w-5 h-5" />
                </button>

                <div className="flex-1 min-w-0">
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (e.target.value.trim().length > 0) {
                        setShowPrompts(false);
                      }
                    }}
                    placeholder="Ask me anything about the product or upload an image..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 resize-none focus:outline-none focus:border-amber-300 transition-colors"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={(!inputText.trim() && !uploadedImage) || isLoading}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white p-3 rounded-xl transition-colors disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewChat;