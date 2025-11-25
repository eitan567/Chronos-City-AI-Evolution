import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, Era, Mission } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const generateCityEvent = async (
  year: number,
  currentEra: Era,
  population: number,
  buildingCount: number,
  currentMission: Mission | null
): Promise<AIResponse> => {
  const ai = getAI();
  
  const missionStatus = currentMission 
    ? `Current Mission: "${currentMission.description}". Is Completed: ${currentMission.completed}.`
    : "No active mission. Please generate a new beginner mission.";

  const prompt = `
    Context:
    - Year: ${Math.floor(year)}
    - Era: ${currentEra}
    - Pop: ${population}
    - Buildings: ${buildingCount}
    - ${missionStatus}
    
    Task:
    1. Analyze progress.
    2. Generate a Hebrew news headline fitting the Era (Wild West = Cowboys/Saloon, Industrial = Factories, Modern = Tech).
    3. Provide rewards (pop/money).
    4. Determine Era (Wild West < 1900, Industrial < 1950, Modern < 2020, Future > 2020).
    5. MISSION LOGIC:
       - If there is NO mission or the previous one is COMPLETED, generate a NEW mission.
       - Target types: POPULATION (reach X people), BUILDING_COUNT (total buildings X), MONEY (reach X $).
       - Keep targets reachable but challenging based on current stats.
       - If current mission is NOT completed, return null for the mission field to keep the old one.

    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Role: City Builder Game Master. Analyze the city status and generate an event.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newsHeadline: { type: Type.STRING, description: "News in Hebrew" },
            populationGrowth: { type: Type.NUMBER },
            moneyBonus: { type: Type.NUMBER },
            era: { type: Type.STRING, enum: ["WILD_WEST", "INDUSTRIAL", "MODERN", "FUTURE"] },
            mission: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                    description: { type: Type.STRING, description: "Mission description in Hebrew" },
                    targetType: { type: Type.STRING, enum: ["POPULATION", "BUILDING_COUNT", "MONEY"] },
                    targetValue: { type: Type.NUMBER }
                }
            }
          },
          required: ["newsHeadline", "populationGrowth", "moneyBonus", "era"]
        }
      }
    });

    const result = JSON.parse(response.text) as AIResponse;
    return result;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      newsHeadline: `שנה ${Math.floor(year)}: העיר צומחת לאט ובטוח.`,
      populationGrowth: 5,
      moneyBonus: 20,
      era: currentEra,
      mission: null
    };
  }
};