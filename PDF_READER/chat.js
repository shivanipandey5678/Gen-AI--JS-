import 'dotenv/config';
import { OpenAI } from 'openai';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";



async function chat() {
    
    

    let USER_PROMPT = `
     The	connection	option in sql
 `;
    
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        
    
    });

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "Rag-assignemnt4",
    }
    );

    const vector_search = vectorStore.asRetriever({
        k: 3
    });

    const relaventChunk = await vector_search.invoke(USER_PROMPT);

    const SYSTEM_PROMPT = ` 

    always try to mention the source place like you are checking it from pdf so page number section number book or pdf
    name .
    ${JSON.stringify(relaventChunk)}`;

 const messages= [
    {role:'system', content:SYSTEM_PROMPT},
    {role:'user', content:USER_PROMPT}
 ]

const response=await  client.chat.completions.create({
     model:'gpt-4o-mini',
     messages
 });

console.log(`> ${response.choices[0].message.content}`)

}

chat();