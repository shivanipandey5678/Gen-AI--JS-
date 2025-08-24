
import "dotenv/config";
import { OpenAI } from "openai";


const openai = new OpenAI({
     apiKey: process.env.GEMINI_API_KEY,   // apna Gemini key env me rakho
     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main(){
    const response = openai.chat.completions.create({
        model : "gemini-2.5-flash",
        messages : [
           {role : "system" , content : "You are a helpful assistant."},
           { role: "user", content: "how to develop a good sense of humor" }
        ]

    })
    console.log((await response).choices[0].message.content)
}

main()