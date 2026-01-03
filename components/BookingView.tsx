
import React, { useState } from 'react';
import { Match, MatchType, SkillLevel, PaymentStatus, PaymentMethod } from '../types';

interface BookingViewProps {
  matches: Match[];
  onBook: (match: Match) => void;
}

const BookingView: React.FC<BookingViewProps> = ({ matches, onBook }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(90);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [matchType, setMatchType] = useState<MatchType>(MatchType.DOUBLES);
  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.MERCADO_PAGO);

  const timeSlots = ['08:00', '09:30', '11:00', '12:30', '15:00', '16:30', '18:00', '19:30', '21:00'];
  const courts = [
    { name: 'Cancha 1 (Panorámica)', price: 4500 },
    { name: 'Cancha 2 (Azul)', price: 4000 },
    { name: 'Cancha 3 (Indoor)', price: 5000 },
    { name: 'Cancha Central Bolívar', price: 6000 }
  ];

  const calculateTotal = () => {
    const court = courts.find(c => c.name === selectedCourt);
    const basePrice = court ? court.price : 4000;
    const factor = duration / 60;
    return Math.round(basePrice * factor);
  };

  const handleProcessPayment = () => {
    const newMatch: Match = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      time: selectedTime,
      duration: duration,
      court: selectedCourt,
      type: matchType,
      levelRequired: SkillLevel.INTERMEDIATE,
      players: [{ id: 'me', name: 'Yo', level: SkillLevel.INTERMEDIATE, avatar: 'https://picsum.photos/50/50?random=99' }],
      maxPlayers: matchType === MatchType.DOUBLES ? 4 : 2,
      price: calculateTotal(),
      paymentStatus: selectedMethod === PaymentMethod.CASH ? PaymentStatus.PENDING : PaymentStatus.APPROVED,
      paymentMethod: selectedMethod
    };
    onBook(newMatch);
    setPaymentStep(false);
    alert(`¡Reserva confirmada! Método: ${selectedMethod}`);
  };

  if (paymentStep) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
          <button onClick={() => setPaymentStep(false)} className="text-slate-400 mb-6 flex items-center gap-2 hover:text-indigo-600 transition-colors">
            ← Volver a selección
          </button>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Finalizar Pago</h2>
          <p className="text-slate-500 mb-8 text-lg">Reserva para {selectedCourt} a las {selectedTime}hs</p>

          <div className="bg-indigo-50 p-6 rounded-3xl mb-8 border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-indigo-900 font-medium">Total a pagar:</span>
              <span className="text-2xl font-black text-indigo-900">${calculateTotal()} ARS</span>
            </div>
            <p className="text-xs text-indigo-400 uppercase font-bold tracking-widest">Precios vigentes en Bolívar, Bs.As.</p>
          </div>

          <div className="space-y-3">
            {[PaymentMethod.MERCADO_PAGO, PaymentMethod.CUENTA_DNI, PaymentMethod.MODO, PaymentMethod.CASH].map(method => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${
                  selectedMethod === method ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <span className="font-bold text-slate-700">{method}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {selectedMethod === method && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>

          <button 
            onClick={handleProcessPayment}
            className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
          >
            Pagar y Confirmar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
        <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Reservar Cancha</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-3">Fecha</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-3">Duración</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                >
                  <option value={60}>60 Minutos</option>
                  <option value={90}>90 Minutos</option>
                  <option value={120}>120 Minutos</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-3">Cancha</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courts.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCourt(c.name)}
                    className={`p-6 rounded-2xl text-left transition-all border-2 ${
                      selectedCourt === c.name ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-black text-slate-800">{c.name}</p>
                    <p className="text-indigo-600 font-bold text-sm mt-1">${c.price} / hr</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-500 uppercase tracking-widest mb-3">Horario</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                      selectedTime === time 
                        ? 'bg-lime-400 text-indigo-900 shadow-lg scale-105' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-10 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-lime-400 rounded-lg"></span> Resumen
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-slate-400">Día</span>
                  <span className="font-bold">{selectedDate}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-slate-400">Hora</span>
                  <span className="font-bold">{selectedTime || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-slate-400">Cancha</span>
                  <span className="font-bold text-right max-w-[150px]">{selectedCourt || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-slate-400">Duración</span>
                  <span className="font-bold">{duration} min</span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-lime-400 font-bold text-xl">Total</span>
                  <span className="text-3xl font-black">${calculateTotal()}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (!selectedTime || !selectedCourt) return alert('Selecciona horario y cancha');
                  setPaymentStep(true);
                }}
                className="w-full mt-10 bg-lime-400 text-indigo-900 py-5 rounded-2xl font-black text-xl hover:bg-lime-300 transition-all active:scale-95 shadow-lg shadow-lime-400/20"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingView;
