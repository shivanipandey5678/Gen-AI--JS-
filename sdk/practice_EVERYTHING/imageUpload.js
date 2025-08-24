import "dotenv/config";
import fs from "fs";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";


async function main() {
  try {
    const result = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe the image in detail." },
            //--------------------------------binary--------------------------
            // {
            //   type: "image",
            //   image: fs.readFileSync("./data/baba.jpeg"), // local file as Buffer
            // },
            {
              type: 'image',
              image: fs.readFileSync('./data/baba.jpeg').toString('base64'),
            },
          ],
        },
      ],
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    console.log("AI Response:", result.text);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
