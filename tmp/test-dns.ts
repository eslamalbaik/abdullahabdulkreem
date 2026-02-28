
import dns from "dns";
import { promisify } from "util";

const resolve = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);

async function testDns() {
    const host = "ep-old-cloud-ai9ykcxu-pooler.c-4.us-east-1.aws.neon.tech";
    console.log(`Resolving ${host}...`);
    try {
        const ipv4 = await resolve(host);
        console.log("IPv4 addresses:", ipv4);
    } catch (err: any) {
        console.log("IPv4 resolution failed:", err.message);
    }

    try {
        const ipv6 = await resolve6(host);
        console.log("IPv6 addresses:", ipv6);
    } catch (err: any) {
        console.log("IPv6 resolution failed:", err.message);
    }
}

testDns();
