import "dotenv/config";
import { OpenAI } from 'openai';

const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});



//     

async function main(){



const SYSTEM_PROMPT = `
     
      you are a assistant who works on START,THINK,OUTPUT format.for a given user query first think and breakdown the problem into sub problems.you should should keep thinking and thinking befor giving the answer.alse before outputing the final result to user you must check once if everything is correct or not.   Rules:-strictly follow the output json format…..
      Rules:
      -strictly follow the output json format
      -always think in the sequence START,THINK,EVALUATE,OUTPUT
      -exicute thinhs in proper sequence one task at a time wait the the current task to complete than go to next line only.
      -always make sure sure to think multiple time specially before giving the final result
      -try to make you point to the point in easy way aviod giving too lengthy answers,
      - explain in concise way
      output in json-
      -{content:string,step:'START' or 'THINK' or'EVALUATE' or'OUTPUT'}

      EXAMPLE:
question: please solve this expression 4 * 2 + 3

assistant: {"content": "please solve this expression 4 * 2 + 3", "step": "START"}
assistant: {"content": "oh this is the math expression ok !", "step": "THINK"}
assistant: {"content": "OK KEEP GOING YOU ARE ON THE RIGHT PATH", "step": "EVALUATE"}
assistant: {"content": "WE CAN SOLVE IT WITH THE HELP OF BODMAS", "step": "THINK"}
assistant: {"content": "OK KEEP GOING YOU ARE ON THE RIGHT PATH", "step": "EVALUATE"}
assistant: {"content": "OK ACCORDING TO BODMAS WE KNOW MULTIPLICATION WILL GET MORE PRIORITY MEANS 8+3", "step": "THINK"}
assistant: {"content": "OK KEEP GOING YOU ARE ON THE RIGHT PATH", "step": "EVALUATE"}
assistant: {"content": "AFTER COMPLETE CALCULATION IT IS 11", "step": "THINK"}
assistant: {"content": "ANSWER OF THIS expression will be 11", "step": "OUTPUT"}

`
const mess=[
    {
        role:'system',
        content:SYSTEM_PROMPT
    },
    { 
        role: "user",
         content: "1* 2 +3" 
    }
];

while(true){
    const response = await client.chat.completions.create({
        model: "gemini-2.5-flash",
        messages:mess
    });

    const rawContent = response.choices[0].message.content;

    let safeContent = rawContent.trim();

// Agar code block aa jaye (```json ... ```)
safeContent = safeContent.replace(/^```json|```$/g, "").trim();

// Agar Gemini ne keys bina quotes diye
safeContent = safeContent.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    const parsedContent =JSON.parse(safeContent);
    
    mess.push({
        role:'assistant',
        content:JSON.stringify(parsedContent)
    });

    if(parsedContent.step === 'START'){
        console.log(`\t🔥`, parsedContent.content);
        continue
    }

   if(parsedContent.step === 'THINK' || parsedContent.step === 'THINKING'){
       
        const client2= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const judge_prompt=`act as a experienced and great judge u have to check the content which is given given by assistant if it is corrent than tell or acknowledge that .if it in incorrect than mention it clearly`
                const response2=await client2.chat.completions.create({
                    model:"gpt-4.1-mini",
                    messages:[
                        {role:'system',content:judge_prompt},
                        {role:'user',content: parsedContent.content}
                    ]
                       
            
                    
                });
                const judge_result=(response2.choices[0].message.content);
                console.log(`\t🧠`, judge_result);
            
                continue
    }

    if (parsedContent.step === 'OUTPUT') {
        console.log(`🤖`, parsedContent.content);
        break;
    }

    console.log('Done...');

}


}



main()

