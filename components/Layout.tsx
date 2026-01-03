
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Inicio', icon: '🏠' },
    { id: 'BOOKING', label: 'Turnos', icon: '🎾' },
    { id: 'PARTNERS', label: 'Parejas', icon: '🤝' },
    { id: 'TOURNAMENTS', label: 'Torneos', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center text-indigo-900 font-bold text-xl">P</div>
          <h1 className="text-2xl font-bold tracking-tight">PadelMaster</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                currentView === item.id ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-800">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full border-2 border-lime-400" alt="Avatar" />
            <div>
              <p className="text-sm font-semibold">Alex Padel</p>
              <p className="text-xs text-indigo-300">Nivel Intermedio</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold">PadelMaster</h1>
          <div className="w-8 h-8 bg-lime-400 rounded-md"></div>
        </header>
        
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>

        {/* Bottom Nav Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                currentView === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] uppercase font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
