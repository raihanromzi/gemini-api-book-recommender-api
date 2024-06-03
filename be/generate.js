import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export const getBookRecommendation = async (genre, favoriteBook, theme) => {
  // Generate suggestion
  const MODEL_NAME = "gemini-1.0-pro";
  const { API_KEY } = process.env;
  if (!API_KEY) {
    console.error("Please provide the API_KEY..");
    return;
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    {
      text: `Please choose your answer given by user delimited by triple dash below and give a short reason why. You will answer in Bahasa Indonesia.

        Example:
        User: Saya suka genre fantasi, buku favorit saya adalah 'Harry Potter', dan saya suka tema petualangan. Bisakah Anda merekomendasikan beberapa buku yang serupa?
        Asisten: Tentu, saya merekomendasikan buku-buku berikut berdasarkan preferensi Anda:

        1. "The Hobbit" oleh J.R.R. Tolkien
           Alasan:
           - Kuat dalam tema petualangan yang dipadukan dengan elemen fantasi.
           - Dunia yang kaya dan penuh imajinasi mirip dengan yang ada di Harry Potter.
           - Plot yang menarik dan penuh eksplorasi.

        2. "Percy Jackson & the Olympians" oleh Rick Riordan
           Alasan:
           - Memiliki tema petualangan dengan elemen fantasi.
           - Karakter yang dinamis dan plot yang seru.
           - Menyajikan mitologi dalam cara yang menyenangkan dan menghibur.

        ---

        User: Saya menyukai genre ${genre}, buku favorit saya adalah '${favoriteBook}', dan saya tertarik dengan tema ${theme}. Dengan informasi ini, buku apa lagi yang bisa Anda rekomendasikan?
        `,
    },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const { response } = result;
  return response.text();
};
