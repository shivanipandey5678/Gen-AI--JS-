import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { GoogleGenAI } from "@google/genai";
import { QdrantVectorStore } from '@langchain/qdrant'; 
import { Document } from "@langchain/core/documents";
import { Embeddings } from "@langchain/core/embeddings";


import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS,"👆👆👆👆👆👆👆👆👆")

async function loadAndClassify(input) {
    let docs;
    let sourceType;
    if (input.includes("youtube.com")) {
        sourceType = "youtube";
        const loader =await  YoutubeLoader.createFromUrl(input, { language: "en", addVideoInfo: true });
        docs = await loader.load();
    } else if (input.toLowerCase().endsWith(".pdf")) {
        sourceType = "pdf";
        const loader = new PDFLoader(input);
        docs = await loader.load();
    }else if (input.toLowerCase().endsWith(".csv")) {
        sourceType = "csv";
        const loader = new CSVLoader(input);
        docs = await loader.load();
    }else if (input.toLowerCase().startsWith("http") || input.toLowerCase().startsWith("https")) {
        sourceType = "website";
        const loader = new CheerioWebBaseLoader(input);
        docs = await loader.load();
    }else {
        sourceType = "text";
        const loader = new TextLoader(input); 
        docs = await loader.load();
    }

    const normalized = docs.map((d, i) => ({
        id: `${sourceType}_${i}`,
        payload: {
          source_type: sourceType,
          content: d.pageContent,
          metadata: d.metadata || {}
        }
      }));

    const embeddingResults = await ai.models.embedContent({
        model: "gemini-embedding-001", 
        contents: normalized.map(doc => ({ content: doc.payload.content }))
    });
    

    const vectorStore = await QdrantVectorStore.fromDocuments( normalized, embeddingResults,{
       url:process.env.QDRANT_URL,
       collectionName:'universalCollection'
    });
    
    console.log('Indexing of documents done...');
}

loadAndClassify('../data/pdf/node-handbook.pdf')
