
import React, { useState } from 'react';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import BookingView from './components/BookingView';
import PartnersView from './components/PartnersView';
import TournamentsView from './components/TournamentsView';
import LoginView from './components/LoginView';
import { View, Match, Tournament, MatchType, SkillLevel, PaymentStatus } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  
  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      date: '2023-10-25',
      time: '18:00',
      duration: 90,
      court: 'Cancha 1 Bolívar Padel',
      type: MatchType.DOUBLES,
      levelRequired: SkillLevel.INTERMEDIATE,
      players: [
        { id: 'u1', name: 'Alex', level: SkillLevel.INTERMEDIATE, avatar: 'https://picsum.photos/50/50?random=1' },
        { id: 'u2', name: 'Marta', level: SkillLevel.INTERMEDIATE, avatar: 'https://picsum.photos/50/50?random=2' }
      ],
      maxPlayers: 4,
      price: 6750,
      paymentStatus: PaymentStatus.APPROVED
    }
  ]);

  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 't1',
      name: 'Abierto Bolívar 2023',
      status: 'OPEN',
      participants: ['Alex', 'Juan', 'Marta', 'Lucas', 'Sofia', 'Roberto', 'Carlos', 'Elena'],
      rounds: []
    }
  ]);

  const handleBookMatch = (newMatch: Match) => {
    setMatches(prev => [...prev, newMatch]);
    setCurrentView('DASHBOARD');
  };

  const handleJoinMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId && m.players.length < m.maxPlayers) {
        return {
          ...m,
          players: [...m.players, { id: 'me', name: 'Yo', level: SkillLevel.INTERMEDIATE, avatar: 'https://picsum.photos/50/50?random=99' }]
        };
      }
      return m;
    }));
  };

  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <DashboardView matches={matches} setView={setCurrentView} />;
      case 'BOOKING':
        return <BookingView matches={matches} onBook={handleBookMatch} />;
      case 'PARTNERS':
        return <PartnersView matches={matches} onJoin={handleJoinMatch} />;
      case 'TOURNAMENTS':
        return <TournamentsView tournaments={tournaments} setTournaments={setTournaments} />;
      default:
        return <DashboardView matches={matches} setView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
