
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
}

// Fix for Node.js 18+ preferring IPv6, which can cause Neon timeouts
if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
}

neonConfig.webSocketConstructor = ws;

async function testConnection() {
    console.log("Testing connection to:", process.env.DATABASE_URL?.split('@')[1]);
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
        const start = Date.now();
        const client = await pool.connect();
        console.log(`Connected in ${Date.now() - start}ms`);
        const res = await client.query("SELECT NOW()");
        console.log("Query result:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        await pool.end();
    }
}

testConnection();
