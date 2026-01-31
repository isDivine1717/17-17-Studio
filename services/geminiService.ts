import { GoogleGenAI, Type } from "@google/genai";
import { ScriptData, GeneratedImage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the "Persona" of 17-17 Studio
const SYSTEM_Context = `
Eres el asistente de IA creativo para "17-17 Studio", un podcast cristiano juvenil basado en Proverbios 17:17.
El tono debe ser: Juvenil, Dinámico, Profundo pero accesible, en Español Latino.
El equipo está formado por: Líder, Daniel Hernandez, Miguel Osuna, David Wilmer, Daniel Garcia, Abraham Toscano.
Usa Reina Valera 1960 (RVR1960) principalmente, o Nueva Traducción Viviente (NTV) si se pide claridad.
`;

export const generatePodcastIdeas = async (topic: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera 5 ideas de episodios para un podcast cristiano juvenil sobre: "${topic}". 
      Formato JSON array de strings. Sé creativo y bíblico.`,
      config: {
        systemInstruction: SYSTEM_Context,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating ideas:", error);
    return ["Error generando ideas. Intenta de nuevo."];
  }
};

export const generateScript = async (topic: string, specificVerse?: string): Promise<ScriptData> => {
  try {
    const prompt = `
      Crea un guion estructurado para un episodio de 25 minutos sobre "${topic}".
      ${specificVerse ? `Versículo base: ${specificVerse}` : 'Elige un versículo clave.'}
      
      Estructura requerida (Usa Markdown):
      1. Título Pegajoso
      2. Intro (2 min): Rompehielo divertido.
      3. Desarrollo (15 min): 3 Puntos bíblicos conversacionales.
      4. Asigna diálogos distribuidos entre: Líder, Daniel H, Miguel, David, Daniel G, Abraham.
      5. Cierre (3 min): Reto práctico y oración.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_Context }
    });

    const text = response.text || "";
    
    // Naive parsing for the purpose of the demo object
    const titleMatch = text.match(/^#\s*(.+)/m);
    const title = titleMatch ? titleMatch[1] : `Episodio: ${topic}`;

    return {
      title,
      topic,
      bibleVerse: specificVerse || "Versículo Sugerido",
      structure: text
    };
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
};

export const generateThumbnail = async (topic: string): Promise<GeneratedImage[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Thumbnail para youtube, diseño gráfico moderno, minimalista, estilo juvenil cristiano, texto grande "17-17", tema visual: ${topic}, colores neón suaves y negro, alta calidad 4k` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    const images: GeneratedImage[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           images.push({
             url: `data:image/png;base64,${part.inlineData.data}`,
             prompt: topic
           });
        }
      }
    }
    return images;
  } catch (error) {
    console.error("Error generating image:", error);
    return [];
  }
};

export const chatWithBot = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    // Basic chat function for the Team Chatbot
    try {
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction: SYSTEM_Context },
            history: history
        });
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (e) {
        console.error(e);
        return "Lo siento, tuve un error de conexión.";
    }
}

export const summarizeVerse = async (verseRef: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Busca el texto de ${verseRef} (RVR1960) y dame una explicación corta y aplicable para jóvenes hoy.`,
            config: { systemInstruction: SYSTEM_Context }
        });
        return response.text || "No se encontró resumen.";
    } catch (e) {
        return "Error al conectar con la Biblia IA.";
    }
}