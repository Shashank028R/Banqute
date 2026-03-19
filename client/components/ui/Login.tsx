
import React from 'react';
import { LogIn, Sparkles } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

export const Login: React.FC = () => {
  const { login } = useOrganization();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-xl mx-auto shadow-indigo-200">
            UP
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">UtsavPro</h1>
            <p className="text-gray-500 font-medium">Banquet Management SaaS</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-left space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest">
              <Sparkles size={14} />
              Welcome Back
            </div>
            <p className="text-sm text-indigo-900/70 leading-relaxed">
              Sign in to manage your banquet hall, bookings, inventory, and accounts in one place.
            </p>
          </div>

          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
          >
            <LogIn className="group-hover:translate-x-1 transition-transform" />
            Sign in with Google
          </button>

          <p className="text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
