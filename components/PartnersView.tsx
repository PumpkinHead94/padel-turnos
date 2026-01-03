
import React, { useState, useEffect } from 'react';
import { Match, SkillLevel } from '../types';
import { suggestPartners } from '../services/geminiService';

interface PartnersViewProps {
  matches: Match[];
  onJoin: (id: string) => void;
}

const PartnersView: React.FC<PartnersViewProps> = ({ matches, onJoin }) => {
  const [aiTip, setAiTip] = useState<string>('Obteniendo consejos de matchmaking...');
  const openMatches = matches.filter(m => m.players.length < m.maxPlayers);

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await suggestPartners('Intermedio', 'San Carlos de Bolívar, Buenos Aires');
      setAiTip(tip);
    };
    fetchTip();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-indigo-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-xl border border-indigo-700">
        <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center text-4xl shrink-0 animate-bounce shadow-lg shadow-lime-400/20">🤖</div>
        <div>
          <h3 className="text-xl font-bold mb-2">Asistente Bolívar Padel</h3>
          <p className="text-indigo-200 italic">"{aiTip}"</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Buscando Pareja</h2>
          <p className="text-slate-500 text-sm">Mostrando partidas en San Carlos de Bolívar</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium outline-none shadow-sm">
            <option>Todos los niveles</option>
            {Object.values(SkillLevel).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {openMatches.map(match => (
          <div key={match.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex gap-6 items-start hover:border-indigo-300 transition-colors">
            <div className="bg-indigo-100 w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-indigo-700 shrink-0">
              <span className="text-xs font-bold uppercase">{match.date.split('-')[2]} OCT</span>
              <span className="text-2xl font-extrabold">{match.time}</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{match.court}</h4>
                  <p className="text-sm text-slate-500">{match.type} • Nivel {match.levelRequired}</p>
                </div>
                <span className="bg-lime-100 text-lime-700 text-xs font-bold px-3 py-1 rounded-full">
                  Faltan {match.maxPlayers - match.players.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-medium">Jugadores:</span>
                <div className="flex -space-x-2">
                  {match.players.map(p => (
                    <img key={p.id} src={p.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt={p.name} />
                  ))}
                </div>
              </div>

              <button 
                onClick={() => onJoin(match.id)}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-95"
              >
                Unirme a la partida
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersView;
