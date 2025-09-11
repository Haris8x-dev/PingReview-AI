import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";

const handleCompare = async () => {
  if (!product1 || !product2) {
    alert("Please enter both product names to compare.");
    return;
  }

  // Rate limiting - enforce 10 second delay between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 10000) {
    const waitTime = Math.ceil((10000 - timeSinceLastRequest) / 1000);
    alert(`Please wait ${waitTime} seconds before making another request to avoid rate limits.`);
    return;
  }

  setLoading(true);
  setResult('');
  setLastRequestTime(now);

  try {
    const prompt = `You are a technical product expert. Compare "${product1}" vs "${product2}" in a concise format.

**${product1} - Key Specs:**
• Spec 1: [Brief detail]
• Spec 2: [Brief detail]
• Spec 3: [Brief detail]
• Spec 4: [Brief detail]
• Spec 5: [Brief detail]
• Price: [Range if known]

**${product2} - Key Specs:**
• Spec 1: [Brief detail]
• Spec 2: [Brief detail]
• Spec 3: [Brief detail]
• Spec 4: [Brief detail]
• Spec 5: [Brief detail]
• Price: [Range if known]

**Winner & Summary:**
[Write exactly 5 lines explaining which product wins and why. Keep each line under 15 words. Focus on the most important deciding factors.]`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    // Add retry logic with exponential backoff
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 429) {
          attempt++;
          if (attempt < maxAttempts) {
            const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(`Rate limited, waiting ${waitTime / 1000}s before retry ${attempt}/${maxAttempts}`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          } else {
            throw new Error('Rate limit exceeded. Please try again in a few minutes.');
          }
        }

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No comparison result available.';
        setResult(output);
        setLoading(false);
        return; // Success, exit retry loop

      } catch (fetchError) {
        if (attempt === maxAttempts - 1) {
          throw fetchError; // Last attempt failed, throw error
        }
        attempt++;
      }
    }

  } catch (error) {
    console.error('Comparison Error:', error);
    setLoading(false);

    if (error.message.includes('Rate limit') || error.message.includes('429')) {
      setResult('⚠️ API Rate Limit Reached\n\nThe AI API has rate limits. Please:\n• Wait 2-3 minutes before trying again\n• Consider upgrading your API plan for higher limits\n\nTip: Text comparisons use less quota than image analysis.');
    } else if (error.message.includes('API_KEY_INVALID')) {
      setResult('Invalid API key. Please check your AI API key.');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      setResult('API quota exceeded. Please try again later or upgrade your plan.');
    } else {
      setResult(`Error: ${error.message}. Please try again.`);
    }
  }
}; import React, { useState } from 'react';
import { ArrowLeft, Loader, Sparkles, Download } from 'lucide-react';

const VsComparison = () => {
  const [product1, setProduct1] = useState('');
  const [product2, setProduct2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    if (!result) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin + 10;

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 123, 255); // Blue heading
      doc.text("PRODUCT COMPARISON REPORT", margin, yPosition);
      yPosition += 15;

      // Date
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;

      // Products compared
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 123, 255);
      doc.text("Products Compared:", margin, yPosition);
      yPosition += 10;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const productLines = [
        `• Product 1: ${product1 || "Image-based product"}`,
        `• Product 2: ${product2 || "Image-based product"}`
      ];
      productLines.forEach(line => {
        const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2);
        doc.text(wrapped, margin, yPosition);
        yPosition += wrapped.length * 7;
      });

      yPosition += 10;

      // Comparison results
      const lines = result.split("\n");
      lines.forEach((line) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        if (line.includes("**") && line.includes(":**")) {
          // Bold section headers
          const cleanLine = line.replace(/\*\*/g, "");
          const wrapped = doc.splitTextToSize(cleanLine, pageWidth - margin * 2);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 123, 255); // Blue headings
          doc.text(wrapped, margin, yPosition);
          yPosition += wrapped.length * 8;
        } else if (line.startsWith("•")) {
          // Bullet points
          const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text(wrapped, margin + 5, yPosition);
          yPosition += wrapped.length * 7;
        } else if (line.trim() !== "") {
          // Regular text
          const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text(wrapped, margin, yPosition);
          yPosition += wrapped.length * 7;
        }
      });

      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100);
        const footerText = "Report generated by AI Product Comparison Tool";
        const wrappedFooter = doc.splitTextToSize(footerText, pageWidth - margin * 2);
        doc.text(wrappedFooter, margin, pageHeight - 15);
      }

      // Save PDF
      doc.save(`Product_Comparison_${Date.now()}.pdf`);

    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleCompare = async () => {
    if ((!product1 && !image1) || (!product2 && !image2)) {
      alert("Please enter product names or upload images for both products.");
      return;
    }

    setLoading(true);
    setResult('');

    try {
      let requestBody = {};
      let model = 'gemini-1.5-flash'; // Updated model name

      if (product1 && product2) {
        // Text-only comparison
        const prompt = `You are a technical product expert. Compare "${product1}" vs "${product2}" in a concise format.

**${product1} - Key Specs:**
• Spec 1: [Brief detail]
• Spec 2: [Brief detail]
• Spec 3: [Brief detail]
• Spec 4: [Brief detail]
• Spec 5: [Brief detail]
• Price: [Range if known]

**${product2} - Key Specs:**
• Spec 1: [Brief detail]
• Spec 2: [Brief detail]
• Spec 3: [Brief detail]
• Spec 4: [Brief detail]
• Spec 5: [Brief detail]
• Price: [Range if known]

**Winner & Summary:**
[Write exactly 5 lines explaining which product wins and why. Keep each line under 15 words. Focus on the most important deciding factors.]`;

        requestBody = {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        };
      } else {
        // Image-based comparison
        model = 'gemini-1.5-pro'; // Better model for vision tasks

        const parts = [{
          text: `You are a technical product expert. Analyze these product images concisely.

**Product 1 Analysis:**
• Type: [What product is this?]
• Brand/Model: [If visible]
• Key Feature 1: [Brief observation]
• Key Feature 2: [Brief observation]
• Key Feature 3: [Brief observation]
• Build Quality: [Assessment from image]

**Product 2 Analysis:**
• Type: [What product is this?]
• Brand/Model: [If visible]
• Key Feature 1: [Brief observation]
• Key Feature 2: [Brief observation]
• Key Feature 3: [Brief observation]
• Build Quality: [Assessment from image]

**Winner & Summary:**
[Write exactly 5 lines explaining which product appears better and why. Keep each line under 15 words. Base on visual analysis only.]`
        }];

        // Add images to parts
        if (image1) {
          const imageBase64_1 = image1.split(',')[1];
          const mimeType = image1.split(';')[0].split(':')[1];
          parts.push({
            inline_data: {
              mime_type: mimeType,
              data: imageBase64_1
            }
          });
        }

        if (image2) {
          const imageBase64_2 = image2.split(',')[1];
          const mimeType = image2.split(';')[0].split(':')[1];
          parts.push({
            inline_data: {
              mime_type: mimeType,
              data: imageBase64_2
            }
          });
        }

        requestBody = {
          contents: [{
            parts: parts
          }]
        };
      }

      // Updated API endpoint (secure via serverless route)
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          ...requestBody
        }),
      });


      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        throw new Error(data.error.message);
      }

      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No comparison result available.';
      setResult(output);
    } catch (error) {
      console.error('Comparison Error:', error);
      setLoading(false);

      if (error.message.includes('API_KEY_INVALID')) {
        setResult('Invalid API key. Please check your AI API key.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        setResult('API quota exceeded. Please try again later.');
      } else {
        setResult(`Error: ${error.message}. Please try again.`);
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-sky-400 via-purple-600 to-purple-900 min-h-screen text-white py-20 px-6 md:px-12 relative">
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

      <div className="max-w-5xl mx-auto text-center">
        <Sparkles className="w-10 h-10 text-yellow-300 mx-auto mb-4" />
        <h2 className="text-4xl font-bold mb-4">Product Comparison</h2>
        <p className="text-white/80 mb-10 max-w-xl mx-auto">
          Compare two products by entering their names. Get an AI-powered recommendation with detailed specifications.
        </p>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          {[1, 2].map((num) => (
            <div key={num} className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-md">
              <label className="block mb-2 font-semibold text-lg">Product {num} Name</label>
              <input
                type="text"
                placeholder={`e.g., iPhone 15 Pro, RTX 4090, MacBook Pro M3`}
                value={num === 1 ? product1 : product2}
                onChange={(e) => num === 1 ? setProduct1(e.target.value) : setProduct2(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
              />
            </div>
          ))}
        </div>

        {/* Compare Button */}
        <button
          onClick={handleCompare}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing Products...
            </>
          ) : (
            "Compare Products"
          )}
        </button>

        {/* Result Output */}
        {result && (
          <div className="mt-10 bg-white/10 border border-white/20 p-6 rounded-xl backdrop-blur-md text-left max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Comparison Result:
              </h3>
              <button
                onClick={generatePDF}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
                title="Download comparison as PDF"
              >
                <Download className="w-4 h-4" />
                Download as PDF
              </button>
            </div>
            <div className="text-white/90 whitespace-pre-line leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VsComparison;