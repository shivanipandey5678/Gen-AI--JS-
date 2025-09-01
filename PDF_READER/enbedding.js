import 'dotenv/config';
import { OpenAI } from 'openai';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";


async function init() {
  const pdfPath = './node-handbook.pdf';
  const loader = new PDFLoader(pdfPath);

  //page by page load the PDF file
  const docs = await loader.load();

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  
  const vectorStore = await QdrantVectorStore.fromDocuments(
     docs,embeddings,{
      url: process.env.QDRANT_URL,
      collectionName: "Rag-assignemnt4",
     }
  );
   
  console.log("Indexing done .......")

};

init()


