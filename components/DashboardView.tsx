
import React from 'react';
import { Match, View, PaymentStatus } from '../types';

interface DashboardViewProps {
  matches: Match[];
  setView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ matches, setView }) => {
  const openMatches = matches.filter(m => m.players.length < m.maxPlayers);
  const myMatches = matches.filter(m => m.players.some(p => p.id === 'me'));

  return (
    <div className="space-y-12 animate-fadeIn pb-24 md:pb-0">
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-2xl relative z-10">
          <h2 className="text-5xl font-black mb-6 tracking-tight">PadelMaster Bolívar</h2>
          <p className="text-indigo-100 text-xl mb-10 leading-relaxed font-medium">Gestioná tus turnos en las mejores canchas de San Carlos de Bolívar. 24/7 disponible.</p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setView('BOOKING')}
              className="bg-lime-400 text-indigo-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/20 active:scale-95"
            >
              Reservar Cancha
            </button>
            <button 
              onClick={() => setView('TOURNAMENTS')}
              className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-all active:scale-95"
            >
              Ver Torneos
            </button>
          </div>
        </div>
      </section>

      {myMatches.length > 0 && (
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span> Tus Próximas Partidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myMatches.map(match => (
              <div key={match.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex gap-6 items-center">
                <div className="bg-slate-50 w-24 h-24 rounded-3xl flex flex-col items-center justify-center border border-slate-100">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{match.date.split('-')[2]} OCT</span>
                  <span className="text-3xl font-black text-slate-900">{match.time}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-xl text-slate-900">{match.court}</h4>
                  <p className="text-slate-500 font-bold mb-3">{match.duration} min • {match.type}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      match.paymentStatus === PaymentStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {match.paymentStatus === PaymentStatus.APPROVED ? 'Pago Confirmado' : 'Pago Pendiente'}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">${match.price} ARS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Partidas Abiertas</h2>
            <p className="text-slate-500 font-bold">Sumate a partidas que buscan jugadores en Bolívar.</p>
          </div>
          <button onClick={() => setView('PARTNERS')} className="text-indigo-600 font-black hover:underline underline-offset-8">Explorar todas</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {openMatches.length > 0 ? (
            openMatches.map(match => (
              <div key={match.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
                <div className="bg-indigo-900 p-5 flex justify-between items-center group-hover:bg-indigo-800 transition-colors">
                  <span className="text-indigo-200 font-black uppercase text-[10px] tracking-widest">{match.type}</span>
                  <span className="bg-lime-400 text-indigo-900 text-[10px] font-black px-3 py-1 rounded-full">{match.levelRequired}</span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">🕒</div>
                    <div>
                      <p className="font-black text-slate-900 text-lg leading-tight">{match.time}hs</p>
                      <p className="text-sm text-slate-400 font-bold">{match.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl">🏟️</div>
                    <p className="font-bold text-slate-700 leading-snug">{match.court}</p>
                  </div>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex -space-x-3">
                      {match.players.map(p => (
                        <img key={p.id} src={p.avatar} className="w-12 h-12 rounded-2xl border-4 border-white shadow-sm" alt={p.name} />
                      ))}
                      {Array.from({ length: match.maxPlayers - match.players.length }).map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-50 flex items-center justify-center text-slate-300 font-black text-xs">+1</div>
                      ))}
                    </div>
                    <span className="text-indigo-600 font-black text-xs">Faltan {match.maxPlayers - match.players.length}</span>
                  </div>
                  <button 
                    onClick={() => setView('PARTNERS')}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                  >
                    Sumarme
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
              <p className="text-slate-400 font-black text-xl mb-4">No hay partidas abiertas.</p>
              <button onClick={() => setView('BOOKING')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Crear nueva partida</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
