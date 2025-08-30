// lib/chatbot.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
// import axios from "axios";
// import 'dotenv/config';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

let llm: ChatGoogleGenerativeAI | null = null;
// Only initialize if API key is available
if (API_KEY) {
  llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.7,
    apiKey: API_KEY,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
  });
}
/**
 * Builds prompt and executes chained LLM call with history.
 * @param messages - Array of user messages
 * @param username - Optional username for personalized responses
 * @returns Promise<string> - Bot response
 */
export async function chatWithGemini(messages: string[], username?: string): Promise<string> {
if (!llm || !API_KEY) {
    throw new Error("Chatbot is currently unavailable. Please check back later.");
  }

  let userInfo = '';
  if (username != null) {
    userInfo = ` User's name is ${username}. Give suggestions according to the gender.`
  }

  const aiMsg = await llm.invoke([
    { role: "system", content: "Strictly reply as a helpful expert who helps people in natural calamities and provide them ways to get out and be calm. Be also concern about the environment. You are a professional that helps user professionally. Do not entertain any talks unrelated to calamities or environment without being rude. Be professional." + userInfo },
    ...messages.map((msg) => ({ role: "user", content: msg })),
  ]);
  return typeof aiMsg.content === 'string' ? aiMsg.content : JSON.stringify(aiMsg.content);
}
