
import { GoogleGenAI, Type } from "@google/genai";
import { TournamentMatch, TournamentRound } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTournamentFixture = async (participants: string[], tournamentName: string): Promise<TournamentRound[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Genera un fixture de torneo para los siguientes participantes: ${participants.join(', ')}. El torneo se llama ${tournamentName}. Devuelve una estructura de rondas (Octavos, Cuartos, Semi, Final según corresponda).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  player1: { type: Type.STRING },
                  player2: { type: Type.STRING },
                  score1: { type: Type.NUMBER },
                  score2: { type: Type.NUMBER },
                  winner: { type: Type.STRING }
                },
                required: ["id", "player1", "player2"]
              }
            }
          },
          required: ["name", "matches"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error parsing fixture JSON:", error);
    return [];
  }
};

export const suggestPartners = async (level: string, location: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Actúa como un asistente de club de pádel. Sugiere consejos para encontrar la pareja ideal para dobles nivel ${level} en la zona de ${location}. Sé breve y motivador.`,
  });
  return response.text;
};
