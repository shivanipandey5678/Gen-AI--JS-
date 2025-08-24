import "dotenv/config";
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
          { type: 'text', text: 'What is his number' },
          {
            type: 'file',
            mediaType: 'application/pdf',
            data: fs.readFileSync('./data/pdf/aug_resume.pdf'),
            filename: 'aug_resume.pdf', 
          },
        ],
      },
    ],
  });
  console.log("AI result from PDF",result.response.messages[0].content)
}

main()