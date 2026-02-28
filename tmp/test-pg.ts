
import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
}

// Ensure IPv4 preference
if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
}

async function testPgConnection() {
    console.log("Testing connection with standard pg driver...");
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 10000,
    });

    try {
        const start = Date.now();
        const client = await pool.connect();
        console.log(`Connected with pg in ${Date.now() - start}ms`);
        const res = await client.query("SELECT NOW()");
        console.log("Query result:", res.rows[0]);
        client.release();
    } catch (err: any) {
        console.error("Standard pg Connection failed:", err.message);
    } finally {
        await pool.end();
    }
}

testPgConnection();
