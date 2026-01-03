
export enum MatchType {
  DOUBLES = 'DOUBLES',
  SINGLES = 'SINGLES'
}

export enum SkillLevel {
  BEGINNER = 'Principiante',
  INTERMEDIATE = 'Intermedio',
  ADVANCED = 'Avanzado',
  PRO = 'Profesional'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PaymentMethod {
  MERCADO_PAGO = 'Mercado Pago',
  CUENTA_DNI = 'Cuenta DNI',
  MODO = 'MODO',
  CASH = 'Efectivo'
}

export interface Player {
  id: string;
  name: string;
  level: SkillLevel;
  avatar: string;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  duration: number; // en minutos
  court: string;
  type: MatchType;
  levelRequired: SkillLevel;
  players: Player[];
  maxPlayers: number;
  price: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface Tournament {
  id: string;
  name: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'FINISHED';
  participants: string[];
  rounds: TournamentRound[];
}

export interface TournamentRound {
  name: string;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  winner?: string;
}

export type View = 'DASHBOARD' | 'BOOKING' | 'PARTNERS' | 'TOURNAMENTS' | 'MY_RESERVATIONS';
