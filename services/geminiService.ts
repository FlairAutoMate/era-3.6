
import { GoogleGenAI, Type } from "@google/genai";
import { VisionAnalysisResult } from '../types';

export const analyzeBuildingImage = async (file: File): Promise<VisionAnalysisResult | null> => {
  try {
    /* fix: initializing ai client inside the function as recommended */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    const base64Data = await base64Promise;

    /* fix: using correct contents structure without nested array */
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: file.type } },
          { text: `Du er ERA Vision Engine. Analyser dette bildet av en bygning/rom.

          MANDAT:
          1. Identifiser spesifikke tekniske avvik (f.eks. råte, flassing, sprekker, lekkasje).
          2. Identifiser estetiske oppgraderingsmuligheter (f.eks. fargevalg, materialbytte).
          3. Identifiser energisparende tiltak (f.eks. vindu-isolering, etterisolering).

          SPESIFIKASJON:
          - Returner en strukturert JSON.
          - Vær konkret i beskrivelsen.
          - Estimert kostnad skal reflektere norske markedspriser for utførelse av mesterbedrift.

          UTGANGS-STRUKTUR:
          findings {
            technical: liste over 2-3 konkrete tekniske funn,
            aesthetic: liste over 1-2 estetiske forslag,
            energy: liste over 1 energitiltak hvis relevant
          }` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_level: { type: Type.STRING, enum: ["low", "moderate", "critical"] },
            value_effect: { type: Type.STRING, enum: ["protect", "increase"] },
            driver: { type: Type.STRING, enum: ["maintenance", "value"] },
            tittel: { type: Type.STRING },
            beskrivelse: { type: Type.STRING },
            estimert_kost: { type: Type.NUMBER },
            enovaSupport: { type: Type.NUMBER },
            projectType: { type: Type.STRING },
            plainLanguageGevinst: { type: Type.STRING },
            findings: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.ARRAY, items: { type: Type.STRING } },
                aesthetic: { type: Type.ARRAY, items: { type: Type.STRING } },
                energy: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["technical", "aesthetic", "energy"]
            }
          },
          required: ["risk_level", "value_effect", "driver", "tittel", "beskrivelse", "estimert_kost", "projectType", "plainLanguageGevinst", "findings"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

export const analyzeSnapshot = async (voiceText: string, imageFile?: File): Promise<any> => {
  try {
    /* fix: initializing ai client inside the function as recommended */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [{ text: `Du er ERA Snapshot Engine. Basert på denne transkripsjonen: "${voiceText}", lag en strukturert oppføring. Unngå finansielt fagspråk. Bruk ord som 'oppgradering', 'fiks' og 'verdi'. Returner JSON.` }];

    if (imageFile) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(imageFile);
      });
      const base64Data = await base64Promise;
      parts.unshift({ inlineData: { data: base64Data, mimeType: imageFile.type } });
    }

    /* fix: using correct contents structure without nested array */
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            cost: { type: Type.NUMBER },
            category: { type: Type.STRING },
            date: { type: Type.STRING }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (e) {
    console.error("Snapshot analysis failed", e);
    return null;
  }
};

export const askEraAssist = async (query: string, context: any, role: string, data: string): Promise<any> => {
    /* fix: initializing ai client inside the function as recommended */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
    Du er ERA OS Core AI. Ditt mandat er å transformere komplekse eiendomsdata til handlingsrettede, dype innsikter som alle forstår.
    KONTEKST DATA: ${data}
    `;

    /* fix: using correct contents structure directly passing string query */
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    actions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                actionId: { type: Type.STRING },
                                type: { type: Type.STRING }
                            },
                            required: ["label", "actionId", "type"]
                        }
                    }
                },
                required: ["text"]
            }
        }
    });

    return response.text ? JSON.parse(response.text) : { text: "Beklager, jeg kunne ikke koble til hjernen min akkurat nå.", actions: [] };
};
