import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';

// 1️⃣ OpenAI embedding model for semantic search
const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-large',
});

// 2️⃣ Load existing Qdrant collection (documents already indexed)
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: 'http://localhost:6333',
  collectionName: 'chaicode-collection',
});

// 3️⃣ Setup retriever from vector store
const retriever = vectorStore.asRetriever({ k: 3 }); // top 3 relevant docs

// 4️⃣ Initialize ChatOpenAI
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.2,
});

// 5️⃣ Chat function
async function chat(userQuery) {
  // 5a. Retrieve relevant docs for context
  const relevantDocs = await retriever.invoke(userQuery);

  // 5b. Create system prompt including retrieved context
  const SYSTEM_PROMPT = `
    You are an AI assistant who answers user questions.
    Only use the following context from documents:
    ${JSON.stringify(relevantDocs)}
  `;

  // 5c. Generate response
  const response = await chatModel.invoke(
    `${SYSTEM_PROMPT}\n\nUser Question: ${userQuery}`
  );

  console.log("AI Response:\n", response);
}

// 6️⃣ Example chat
await chat("Tell me about adding two numbers in Python");
await chat("Explain Node.js events");
