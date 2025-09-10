import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Sparkles, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    setLoading(true);

    try {
      await addDoc(collection(db, 'messages'), {
        name,
        message,
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
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

      <div className="max-w-3xl mx-auto text-center">
        <Sparkles className="w-10 h-10 text-yellow-300 mx-auto mb-4" />
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-white/80 mb-10">
          Have feedback, questions, or ideas? Send us a message using the form below.
        </p>

        {submitted ? (
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-6 text-green-300">
            ✅ Thank you! Your message has been sent.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-xl text-left space-y-4"
          >
            <div>
              <label className="block mb-1 font-medium text-white">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-white">Your Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300"
                placeholder="Type your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;
