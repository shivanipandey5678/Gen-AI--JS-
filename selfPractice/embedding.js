import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
  
});

async function main(){
    const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputing the final result to user you must check once if everything is correct.

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, EVALUATE and OUTPUT.
    - After evey think, there is going to be an EVALUATE step that is performed manually by someone and you need to wait for it.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.

    Output JSON Format:
    { "step": "START | THINK | EVALUATE | OUTPUT", "content": "string" }

    Example:
    User: Can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" } 
    ASSISTANT: { "step": "THINK", "content": "This is typical math problem where we use BODMAS formula for calculation" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Lets breakdown the problem step by step" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "As per bodmas, first lets solve all multiplications and divisions" }
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" }  
    ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4 * 10 that is 40" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 12" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications lets do the add and subtract" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "so, 3 + 40 = 43" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "new equations look like 43 - 12 which is 31" } 
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
    ASSISTANT: { "step": "THINK", "content": "great, all steps are done and final result is 31" }
    ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" }  
    ASSISTANT: { "step": "OUTPUT", "content": "3 + 4 * 10 - 4 * 3 = 31" } 
  `;


  const JUDGE_PROMPTING =`
       see u are a great judge which basically check the content very carefully,
       after proper checking you have  give feedback properly whether the other llm is going in the right path or not .
        - Strictly follow the output JSON format
  `

    const messages = [
        {
        role: 'system',
        content: SYSTEM_PROMPT,
        },
        {
        role: 'user',
        content: 'how to  learn arument',
        },
    ];

    while(true){
       
        try {
            const response = await openai.chat.completions.create({
                model:"gpt-3.5-turbo",
                messages:messages
            });

            const rawContent = response.choices[0].message.content;
            console.log(rawContent)
        } catch (error) {
            console.error("❌ OpenAI API Error:", error.message);
            break;
        }
      

        
       

       


     
          const  parsedContent = JSON.parse(rawContent);
      

        messages.push({
           role:'assistant',
           content:JSON.stringify(parsedContent)
        });

        if(parsedContent.step==='START'){
            console.log(`\t🔥`, parsedContent.content);
            continue;
        }

        if(parsedContent.step === 'THINK'){
            const client2 = new OpenAI({
                  apiKey:process.env.OPENAI_API_KEY
                 
            })

            const response2 = await client2.chat.completions.create({
                model:"gpt-4.1-mini",
                messages:[
                    {
                        role:'system',
                        content: JUDGE_PROMPTING
                    },
                    {
                        role:'user',
                        content: parsedContent.content
                    }
                ]
            });

            messages.push({
                role: 'developer',
                content: JSON.stringify({
                  step: 'EVALUATE',
                  content: String,
                }),
              });
        
            

            console.log(`\t🧠`,response2.choices[0].message.content)
            continue;

        }

        if (parsedContent.step === 'OUTPUT') {
            console.log(`🤖`, parsedContent.content);
            break;
        }

        console.log('Done...');
    }




}

main();






























// import 'dotenv/config';
// import { OpenAI } from 'openai';


// const openai = new OpenAI({
//     apiKey: process.env.GEMINI_API_KEY,   // apna Gemini key env me rakho
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });
// async function init(){
//      let userquery ='';
//      const result = openai.embeddings.create({
//           model:'text-embedding-3-large',
//           input:userquery
          
//      })

//      console.log(result.data[0].embedding.length);
// }

// init()