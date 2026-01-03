
import React, { useState } from 'react';
import { Tournament } from '../types';
import { generateTournamentFixture } from '../services/geminiService';

interface TournamentsViewProps {
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
}

const TournamentsView: React.FC<TournamentsViewProps> = ({ tournaments, setTournaments }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFixture = async (tournamentId: string) => {
    setIsGenerating(true);
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      const fixture = await generateTournamentFixture(tournament.participants, tournament.name);
      setTournaments(prev => prev.map(t => {
        if (t.id === tournamentId) {
          return { ...t, status: 'IN_PROGRESS', rounds: fixture };
        }
        return t;
      }));
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gestión de Torneos</h2>
          <p className="text-slate-500">Organiza fixtures y sigue el progreso de los cuadros.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          + Crear Torneo
        </button>
      </div>

      {tournaments.map(tournament => (
        <div key={tournament.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{tournament.name}</h3>
              <p className="text-slate-400 text-sm">{tournament.participants.length} participantes inscritos</p>
            </div>
            <div className="flex gap-3">
              {tournament.status === 'OPEN' ? (
                <button 
                  onClick={() => handleGenerateFixture(tournament.id)}
                  disabled={isGenerating}
                  className="bg-lime-400 text-indigo-900 px-5 py-2 rounded-lg font-bold hover:bg-lime-300 disabled:opacity-50 transition-all"
                >
                  {isGenerating ? 'Generando...' : 'Generar Fixture con IA'}
                </button>
              ) : (
                <span className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider">En Progreso</span>
              )}
            </div>
          </div>

          <div className="p-8">
            {tournament.rounds.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-6">
                {tournament.rounds.map((round, rIndex) => (
                  <div key={rIndex} className="min-w-[280px] space-y-4">
                    <h4 className="text-indigo-600 font-extrabold uppercase text-xs tracking-widest text-center border-b border-indigo-50 pb-2">{round.name}</h4>
                    <div className="space-y-4 flex flex-col justify-around h-full">
                      {round.matches.map(match => (
                        <div key={match.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                          <div className={`flex justify-between items-center py-2 border-b border-slate-100 ${match.winner === match.player1 ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                            <span>{match.player1}</span>
                            <span className="bg-white px-2 py-1 rounded border text-xs">{match.score1 ?? '-'}</span>
                          </div>
                          <div className={`flex justify-between items-center py-2 ${match.winner === match.player2 ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                            <span>{match.player2}</span>
                            <span className="bg-white px-2 py-1 rounded border text-xs">{match.score2 ?? '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📜</div>
                <h4 className="text-lg font-bold text-slate-800">El fixture no se ha generado</h4>
                <p className="text-slate-500 mb-6">Completa la lista de inscritos y usa la IA para crear el cuadro competitivo.</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                  {tournament.participants.map(p => (
                    <span key={p} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentsView;
