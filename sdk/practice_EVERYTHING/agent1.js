import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import fs from "fs";
import { google } from "@ai-sdk/google";
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

async function generateMarketingCopy(input) {
  const model =  google('gemini-1.5-flash');

  // Step 1: Generate marketing copy
  const { text: copy } = await generateText({
    model,
    prompt: `Write persuasive marketing copy for: ${input}. Focus on benefits and emotional appeal.`,
  });

  // Step 2: Perform quality check on copy
  const { object: qualityMetrics } = await generateObject({
    model,
    schema: z.object({
      hasCallToAction: z.boolean(),
      emotionalAppeal: z.number().min(1).max(10),
      clarity: z.number().min(1).max(10),
    }),
    prompt: `Evaluate this marketing copy for:
    1. Presence of call to action (true/false)
    2. Emotional appeal (1-10)
    3. Clarity (1-10)

    Copy to evaluate: ${copy}`,
  });

  // Step 3: If quality check fails, regenerate with improvements
  if (
    !qualityMetrics.hasCallToAction ||
    qualityMetrics.emotionalAppeal < 7 ||
    qualityMetrics.clarity < 7
  ) {
    const { text: improvedCopy } = await generateText({
      model,
      prompt: `Rewrite this marketing copy with:
      ${!qualityMetrics.hasCallToAction ? '- A clear call to action' : ''}
      ${qualityMetrics.emotionalAppeal < 7 ? '- Stronger emotional appeal' : ''}
      ${qualityMetrics.clarity < 7 ? '- Improved clarity and directness' : ''}

      Original copy: ${copy}`,
    });

    return { copy: improvedCopy, qualityMetrics };
  }

  // Step 4: Return final copy with metrics
  return { copy, qualityMetrics };
}

// Example usage
generateMarketingCopy("Eco-friendly water bottle").then(result => {
  console.log("Final Copy:", result.copy);
  console.log("Quality Metrics:", result.qualityMetrics);
});
