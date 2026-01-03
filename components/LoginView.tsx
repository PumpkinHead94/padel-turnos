
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    setLoading(provider);
    // Simulamos la redirección y respuesta de OAuth
    setTimeout(() => {
      onLogin();
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-lime-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-20 h-20 bg-lime-400 rounded-2xl flex items-center justify-center text-indigo-900 font-black text-4xl mx-auto mb-6 shadow-lg shadow-lime-400/20">
            P
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PadelMaster</h1>
          <p className="text-indigo-200 mb-10">San Carlos de Bolívar</p>

          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin('Gmail')}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Gmail" />
              {loading === 'Gmail' ? 'Conectando...' : 'Continuar con Gmail'}
            </button>

            <button
              onClick={() => handleSocialLogin('Facebook')}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              {loading === 'Facebook' ? 'Conectando...' : 'Continuar con Facebook'}
            </button>

            <button
              onClick={() => handleSocialLogin('Instagram')}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 disabled:opacity-50"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              {loading === 'Instagram' ? 'Conectando...' : 'Continuar con Instagram'}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-indigo-300 text-xs">
            Al continuar, aceptas nuestros términos y condiciones de uso en San Carlos de Bolívar.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
