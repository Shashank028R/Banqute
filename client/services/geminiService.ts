
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiAssistant {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async suggestMenu(eventType: string, guestCount: number) {
    const prompt = `Suggest a premium Indian banquet menu for a ${eventType} with ${guestCount} guests. 
    Include appetizers, main course (Indian specialties), and traditional desserts. 
    Format as a structured list. Include a short advice on seating arrangements.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate suggestions at this moment.";
    }
  }

  async analyzeReview(review: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform sentiment analysis on this banquet customer review: "${review}". 
      Return a JSON with "sentiment" (Positive/Negative/Neutral) and "keyPoints" (array of strings).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["sentiment", "keyPoints"]
        }
      }
    });
    return JSON.parse(response.text);
  }
}
