import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateLogisticsReport = async (acres: number, briquettes: number): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    I am planning a land management project.
    Input Data:
    - Area: ${acres} acres
    - Product: ${briquettes} briquettes (standard size, roughly similar to a hockey puck or charcoal briquette).
    - Coverage: 1 per 100 sq ft.
    
    Please generate a helpful "Logistics & Application Plan" in Markdown format. 
    Structure the response strictly as follows:
    
    ## 📋 Project Overview
    [A 1-sentence summary of the scale of this operation, e.g. "Small residential task" vs "Large agricultural operation"].

    ## 🚚 Logistics Estimates
    - **Estimated Total Weight:** [Calculate approx weight assuming 0.5 oz per briquette, convert to lbs].
    - **Volume Visualization:** [A metaphor for the volume, e.g. "Fits in a backpack" or "Requires a pickup truck bed"].

    ## ⏱️ Application Time
    - **Manual Application:** [Estimated time for one person to walk and drop].
    - **Mechanized/Team Application:** [Estimated time if using a spreader or team, if applicable for this scale].

    ## 💡 Pro Tips
    1. [Tip about grid patterns or marking territory].
    2. [Tip about storage or handling].
    3. [Tip about safety or environmental checking].

    Keep the tone professional, encouraging, and concise. Do not include conversational filler.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7, // Slightly creative but factual
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
