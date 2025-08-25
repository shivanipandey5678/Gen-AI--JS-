import dotenv from 'dotenv';
dotenv.config({path:'../.env'})
import fs from "fs";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";


async function main() {
  try {
    const { textStream } = streamText({
        model: google('gemini-2.0-flash'),
        prompt: 'Invent a new holiday and describe its traditions.',
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
      });

      for await (const chunk of c) {
        process.stdout.write(chunk); 
      }
  
      console.log("\n--- Done ---");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
