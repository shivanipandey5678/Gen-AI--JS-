import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import fs from "fs";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

async  function main(){
    
const result = await generateText({
    model: google('gemini-1.5-flash'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What is the audio saying?' },
          {
            type: 'file',
            mediaType: 'audio/mpeg',
            data: fs.readFileSync('../data/mp3_audio/ziddiDil.mp3'),

          },
        ],
      },
    ],
  });
  console.log("AI result from Audio",result.response.messages[0].content)
}

main()