import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })
import fs from "fs";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

async function main() {
    try {
        const exampleCsvPath = '../data/csv/example.csv'
        const loader = new CSVLoader(exampleCsvPath, {
            columns:  ["review_text", "app_name", "rating"],
            separator: "｜",
        });


        const singleColumnDocs = await loader.load();
        console.log(singleColumnDocs);
        console.log("😱😱😱😱😱😱😱😱")
        

        console.log("🏡🏡🏡🏡🏡\n--- Done ---");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
