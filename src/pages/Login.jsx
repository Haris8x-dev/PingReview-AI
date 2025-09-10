import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed
import { ArrowLeft, LogIn, LogOut, Sparkles, User, Mail, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const Login = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // No need to manually set user - AuthContext will handle it
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const renderProfileLetter = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
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

      <div className="max-w-xl mx-auto text-center">
        <Sparkles className="w-10 h-10 text-yellow-300 mx-auto mb-4" />
        <h2 className="text-4xl font-bold mb-6">Login to Pingreview.Ai</h2>

        {!user ? (
          <>
            <p className="text-white/80 mb-6">Sign in with Google to access your personalized profile.</p>
            <button
              onClick={handleGoogleLogin}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-all flex items-center gap-2 mx-auto"
            >
              <LogIn className="w-5 h-5" />
              Sign in with Google
            </button>
          </>
        ) : (
          <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-400 text-black font-bold w-12 h-12 rounded-full flex items-center justify-center text-xl">
                {renderProfileLetter(user.email)}
              </div>
              <div>
                <div className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" /> {user.name}
                </div>
                <div className="text-white/80 flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" /> {user.email}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm text-white/90">
              <Info className="w-4 h-4 mt-1 text-yellow-300" />
              <p>{user.bio}</p>
            </div>

            <button
              onClick={logout}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;