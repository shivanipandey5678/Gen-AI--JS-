import dotenv from "dotenv";
dotenv.config({ path: "../.env" });  
import qdrant from './qdrant.config.js';

async function main() {
  try {
    // Step 1: List all collections
    const allCollections = await qdrant.getCollections();
    console.log("📂 All Collections:", allCollections);

    // Step 2: If none exists, create one
    if (allCollections.collections.length === 0) {
      console.log("⚡ Creating new collection...");
      await qdrant.createCollection("my_notes", {
        vectors: { size: 1536, distance: "Cosine" }
      });
    }

    // Step 3: Fetch the collection
    const myCol = await qdrant.getCollection("my_notes");
    console.log("✅ My Collection:", myCol);

  } catch (error) {
    console.error("❌ Qdrant connection error:", error);
  }
}

main();
