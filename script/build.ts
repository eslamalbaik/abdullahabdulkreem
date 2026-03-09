import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

const allowlist = [
  "@google/generative-ai",
  "axios",
  "cors",
  "date-fns",
  "express",
  "express-rate-limit",
  "jsonwebtoken",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "resend",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];

  // Mark all dependencies not in allowlist as external
  // Also explicitly mark all Node.js built-ins as external
  const nodeBuiltins = [
    "node:events", "node:util", "node:http", "node:https", "node:os",
    "node:path", "node:fs", "node:stream", "node:tty", "node:url", "node:crypto"
  ];

  const externals = [
    ...allDeps.filter((dep) => !allowlist.includes(dep)),
    ...nodeBuiltins,
  ];

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: "dist/index.js",
    minify: true,
    external: externals,
    logLevel: "info",
    banner: {
      js: `
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`,
    },
  });

  console.log("build complete! outputs in dist/");
  console.log("- frontend: dist/public/");
  console.log("- backend: dist/index.js (ESM)");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
