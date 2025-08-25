import dotenv from 'dotenv';
dotenv.config({path:'../.env'})
import fs from "fs";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";


async function main() {
  try {

    const loader = YoutubeLoader.createFromUrl("https://www.youtube.com/watch?v=eyI5WkbSckI", {
      language: "en",
      addVideoInfo: true,
    });
    
    const docs = await loader.load();
    const { textStream } = streamText({
        model: google('gemini-2.0-flash'),
        prompt: "Summarize this transcript (in english properly): " + docs[0].pageContent,
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
      });

      for await(let chunk of textStream){
        process.stdout.write(chunk); 
      }
      
    
      console.log("🏡🏡🏡🏡🏡\n--- Done ---");
      
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
