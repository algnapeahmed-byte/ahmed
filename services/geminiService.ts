import { GoogleGenAI, Modality } from "@google/genai";
import type { Part, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export async function generateHugImage(imagePart1: Part, imagePart2: Part, prompt: string): Promise<string> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    imagePart1,
                    imagePart2,
                    { text: prompt }
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        // Check for safety blocks or empty responses first
        if (!response.candidates || response.candidates.length === 0) {
            console.error("Gemini API response blocked or empty:", JSON.stringify(response, null, 2));
             if (response.promptFeedback?.blockReason) {
                 throw new Error(`تم رفض الطلب لأسباب تتعلق بالسلامة (${response.promptFeedback.blockReason}). يرجى محاولة استخدام صور مختلفة.`);
            }
            throw new Error("استجابة غير متوقعة من النموذج، لم يتم إرجاع أي محتوى.");
        }

        const content = response.candidates[0].content;
        if (content && content.parts) {
            for (const part of content.parts) {
                // Find and return the first image part
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    return `data:${mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        
        // If we reach here, no image part was found in the response.
        const textResponse = response.text;
        console.warn("Model did not return an image. Full response:", JSON.stringify(response, null, 2));
        
        const errorMessage = textResponse 
            ? `لم يتم العثور على صورة في استجابة النموذج. رسالة النموذج: "${textResponse}"`
            : "لم يتم العثور على صورة في استجابة النموذج. قد يكون المحتوى غير مناسب.";

        throw new Error(errorMessage);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            // Let our custom, user-friendly errors pass through to the UI.
            if (error.message.startsWith("تم رفض الطلب") || error.message.startsWith("لم يتم العثور على صورة") || error.message.startsWith("استجابة غير متوقعة")) {
                throw error;
            }
        }
        // For other errors (e.g., network issues), throw a generic message.
        throw new Error("فشل إنشاء الصورة. يرجى التحقق من وحدة التحكم لمزيد من التفاصيل.");
    }
}
