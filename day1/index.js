// import "dotenv/config";
// import { OpenAI } from "openai";

// const client = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
// });

// async function main() {
//   const SYSTEM_PROMPT = `
// You are an assistant who works on START, THINK, EVALUATE, OUTPUT format.  
// For a given user query, first think and break the problem into sub-problems.  
// You must keep thinking and re-checking before giving the final answer.  

// Rules:
// - Strictly follow the output JSON format
// - Always think in the sequence START → THINK → EVALUATE → OUTPUT
// - Do NOT generate multiple steps in a single response.
// - Wait for the next message before continuing.
// - Execute things in proper sequence one task at a time
// - One step per message. Never include multiple steps in one reply.
// - No prose, no markdown, no code fences. Only a single JSON object.
// - Make sure to think multiple times, especially before final OUTPUT
// - Be concise and to the point
// - Output JSON only in format: {"content": string, "step": "START" | "THINK" | "EVALUATE" | "OUTPUT"}

// Example:
// User: solve 4 * 2 + 3

// Assistant:
// {"content": "please solve this expression 4 * 2 + 3", "step": "START"}
// {"content": "oh this is the math expression ok !", "step": "THINK"}
// {"content": "OK KEEP GOING YOU ARE ON THE RIGHT PATH", "step": "EVALUATE"}
// {"content": "OK ACCORDING TO BODMAS WE KNOW MULTIPLICATION WILL GET MORE PRIORITY MEANS 8+3", "step": "THINK"}
// {"content": "OK KEEP GOING YOU ARE ON THE RIGHT PATH", "step": "EVALUATE"}
// {"content": "AFTER COMPLETE CALCULATION IT IS 11", "step": "THINK"}
// {"content": "ANSWER OF THIS expression will be 11", "step": "OUTPUT"}
// `;

//   const mess = [
//     { role: "system", content: SYSTEM_PROMPT },
//     { role: "user", content: "how to increase linkedin followers" },
//   ];

//   while (true) {
//     const response = await client.chat.completions.create({
//       model: "gemini-2.5-flash",
//       messages: mess,
//     });
    
//     let rawContent = response.choices[0].message.content.trim();

//     // ✅ Clean output before parsing
//     rawContent = rawContent.replace(/^```json|```$/g, "").trim();
//     rawContent = rawContent.replace(
//       /([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,
//       '$1"$2":'
//     );

//     let parsedContent;
//     try {
//       // extract only {...} block
//       const match = rawContent.match(/\{[\s\S]*\}/);
//       if (!match) throw new Error("No valid JSON found");
//       parsedContent = JSON.parse(match[0][0]);
//     } catch (err) {
//       console.error("❌ JSON Parse Error:", err.message);
//       console.log("Raw Response:", rawContent);
//       break;
//     }

//     // push back to conversation
//     mess.push({
//       role: "assistant",
//       content: JSON.stringify(parsedContent),
//     });

//     // 🔥 START
//     if (parsedContent.step === "START") {
//       console.log(`\t🔥`, parsedContent.content);
//       continue;
//     }

//     // 🧠 THINK → send to judge
//     if (parsedContent.step === "THINK") {
//       const client2 = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//       const judge_prompt = `You are an experienced judge. 
//       Check the assistant's reasoning step.
//       If correct → acknowledge briefly.
//       If incorrect → point it out clearly.`;

//       const response2 = await client2.chat.completions.create({
//         model: "gpt-4.1-mini",
//         messages: [
//           { role: "system", content: judge_prompt },
//           { role: "user", content: parsedContent.content },
//         ],
//       });

//       const judge_result = response2.choices[0].message.content;
//       console.log(`\t🧠`, judge_result);
//       continue;
//     }

//     // ✅ EVALUATE
//     if (parsedContent.step === "EVALUATE") {
//       console.log(`\t📊`, parsedContent.content);
//       continue;
//     }

//     // 🤖 OUTPUT
//     if (parsedContent.step === "OUTPUT") {
//       console.log(`🤖`, parsedContent.content);
//       break;
//     }
//   }
// }

// main();


import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function main() {
  const stream = await client.chat.completions.create({
    model: "gemini-2.5-flash",
    stream: true,
    messages: [{ role: "user", content: "Explain BODMAS in 10 lines" }],
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }

  console.log("\n--- Completed ---");
}

main();
