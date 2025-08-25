import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { QdrantVectorStore as QdrantClient} from '@langchain/qdrant'; 

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

try {
    const result = await client.getCollections();
    if(result.collections.length==0){
        console.log('❌ There is no collections:');
        await client.createCollection('universalCollection', {
            vectors: {
              size: 3072,    
              distance: 'Cosine',
            },
          });
        console.log("new collection created 🟢")
    }
   
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}
   

