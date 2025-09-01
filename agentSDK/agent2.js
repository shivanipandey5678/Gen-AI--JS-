// in this file i will practice handoffs and how u can pass one agent as a tool inside another agnet as tools ke biche back forth possible hai if 
// gatway agent hai to agent bich possible nhi hai to hack se solve hogi problem

import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';



const gymTrainer = tool({
    name: 'gym_trainer',
    description: 'You are an expert in gym, act as an experienced trainer. You can guide about impactful exercise and posture.',
    parameters: z.object({
        goal: z.string().describe("The user’s goal, e.g. 'weight loss', 'muscle gain', 'posture correction'")
    }),
    async execute({ goal }) {
        if (goal.toLowerCase() === 'weight loss') {
            return `
  ✅ Weight Loss Plan:
  - Cardio: 30 mins brisk walking / cycling / running (5 days a week)
  - Strength: Full-body circuit (push-ups, squats, planks, lunges) — 3 sets of 12 reps
  - Posture: Keep your core tight, shoulders back while exercising
  - Nutrition: Focus on calorie deficit, high protein, low sugar
  `;
        } else if (goal.toLowerCase() === 'muscle gain') {
            return `
  💪 Muscle Gain Plan:
  - Compound lifts: Bench press, Deadlift, Squats, Pull-ups
  - Isolation: Biceps curls, Tricep dips, Shoulder raises
  - Posture: Control weight slowly, avoid jerky movements
  - Nutrition: High protein, slight calorie surplus
  `;
        } else if (goal.toLowerCase() === 'posture correction') {
            return `
  🧘 Posture Correction:
  - Exercises: Cat-Cow stretch, Plank, Superman, Wall Angels
  - Daily Habit: Avoid slouching, keep monitor at eye level
  - Strength: Focus on core + back strengthening
  `;
        } else {
            return `
  Hi! I am your gym trainer 🏋️
  Please specify a goal like: 'weight loss', 'muscle gain', or 'posture correction'.
  `;
        }
    }
});


const dietitian = tool({
    name: 'dietitian',
    description: 'You are an experienced dietitian, you provide diet charts and nutrition advice based on the user’s fitness goal.',
    parameters: z.object({
        goal: z.string().describe("User's goal: 'weight loss', 'muscle gain, or posture correstion'")
    }),
    async execute({ goal }) {
        if (goal.toLowerCase() === 'weight loss') {
            return`
            🥗 Weight Loss Diet:
- Breakfast: Oats with skimmed milk + 1 boiled egg
- Mid-morning: Green tea + handful of almonds
- Lunch: Grilled chicken/fish or paneer + salad + 1 chapati
- Evening: Black coffee/green tea + sprouts
- Dinner: Light soup + sautéed veggies
⚡ Tip: Stay in calorie deficit, avoid sugar and fried foods.
            `
        } else if (goal.toLowerCase() === 'muscle gain') {
            return`
               💪 Muscle Gain Diet:
- Breakfast: 4 egg whites + oats + banana
- Mid-morning: Protein shake + peanut butter sandwich
- Lunch: Brown rice + chicken breast/fish/tofu + veggies
- Evening: Paneer/Greek yogurt + nuts
- Dinner: Whole wheat chapati + dal + chicken/fish/paneer
⚡ Tip: High protein, slight calorie surplus, 2–3L water daily.
            `
        } else if (goal.toLowerCase() === 'posture correction') {
            return `
               Posture Correction Diet:
- Balanced diet with protein, healthy fats, and calcium
- Breakfast: Milk/yogurt + fruits + oats
- Lunch: Rice/roti + dal + leafy vegetables
- Evening: Smoothie (milk + banana + flaxseeds)
- Dinner: Light meal with protein source (paneer, chicken, or fish)
⚡ Tip: Focus on vitamin D, calcium, magnesium for bone and muscle health.
            `
        } else {
            return`
             Hi! I am your dietitian 🥗
Please specify a goal like: 'weight loss', 'muscle gain', or 'posture correction'.
            `
        }
    }
})




// first agent gymTrainer,fitness releted
const agent = new Agent({
    name: 'agent1',
    model: 'gpt-4o-mini',
    tools: [gymTrainer, dietitian,agent2.asTool()],
    instructions: 'You are a helpful assistant , be aware about your context is related to health and fitness from same context you have your tools if someone ask anuything apart from thsi context respectfully convey that this is not my speciality do ask me about my context only .after each query by user do apricate the user in genuine way after that give ans and make sure at the end of your ans do ask some follow up question for example they ask about biceps exercise after giving them answer ask once do you also want to know about some really effective triceps exercise and ask in this way user will ask for sure ',
});

// coding releted agent
const agent2 = new Agent({
    name: 'agent2',
    model: 'gpt-4o-mini',
    tools:[agent.asTool()],
    instructions:' you are helpful assistant great at coding you explain topic in great way with example driven architecture with simple way use cool emoji which make things interesting'
});

const handOffAgent = Agent.create({
    name:'decision maker',
    instructions: "You determine which agent to use based on the user's  question",
    handoffs: [agent, agent2],
})

async function main() {
const result = await run(
    handOffAgent,
    'how to be a great ui ux designer '
);
return result
}
// console.log(result.finalOutput);

main()
.then((res)=>{
    console.log(res.history,'💪💪💪💪💪💪')
    console.log(res.finalOutput,'☕☕☕☕☕☕☕☕')
})
.catch((error)=>{
    console.error(error)
})