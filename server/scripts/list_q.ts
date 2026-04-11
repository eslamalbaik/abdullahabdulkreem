import { connectDB } from "../db";
import { storage } from "../storage";

async function list() {
    await connectDB();
    const questionnaires = await storage.getDynamicQuestionnaires();
    console.log("Questionnaires:", JSON.stringify(questionnaires, null, 2));
    process.exit(0);
}

list();
