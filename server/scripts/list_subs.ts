import { connectDB } from "../db";
import { storage } from "../storage";

async function listSubmissions() {
    await connectDB();
    const submissions = await storage.getQuestionnaireSubmissions();
    console.log("Submissions (Legacy):", JSON.stringify(submissions, null, 2));
    process.exit(0);
}

listSubmissions();
