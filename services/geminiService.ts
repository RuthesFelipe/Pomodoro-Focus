
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const breakDownTask = async (taskTitle: string, lang: Language): Promise<string[]> => {
  const langNames = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish"
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down this task into 3-5 extremely simple, non-intimidating steps for someone with ADHD or concentration difficulties. Provide the steps in ${langNames[lang]}: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of small sub-steps",
            },
          },
          required: ["steps"],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Empty response");
    
    const data = JSON.parse(jsonStr.trim());
    return data.steps || [];
  } catch (error) {
    console.error("Error breaking down task:", error);
    const defaults = {
      en: ["Start small", "Do one bit at a time", "Take a breath"],
      pt: ["Comece pequeno", "Faça uma parte por vez", "Respire fundo"],
      es: ["Empieza poco a poco", "Haz una parte a la vez", "Respira hondo"]
    };
    return defaults[lang];
  }
};
