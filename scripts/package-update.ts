import { execSync } from "child_process";
import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";

async function calculateHash(filePath: string) {
  const content = await fs.readFile(filePath);
  return createHash("sha256").update(content).digest("hex");
}

async function packageUpdate() {
  const channel = process.env.NODE_ENV === "development" ? "development" : "production";
  const webDir = path.join(process.cwd(), "dist");
  const updateDir = path.join("..", "crm-web", "public", "live-updates", channel);

  // Build the web assets
  console.log("Building web assets...");
  execSync("pnpm build", { stdio: "inherit" });

  // Create update directory
  await fs.mkdir(updateDir, { recursive: true });

  // Create zip bundle
  console.log("Creating bundle...");
  execSync(`cd ${webDir} && zip -r bundle.zip ./*`);

  // Move bundle to updates directory
  await fs.rename(path.join(webDir, "bundle.zip"), path.join(updateDir, "bundle.zip"));

  // Calculate bundle hash
  const bundleHash = await calculateHash(path.join(updateDir, "bundle.zip"));

  // Create manifest
  const manifest = {
    version: Date.now().toString(),
    bundleHash,
    url: `live-updates/${channel}/bundle.zip`,
  };

  await fs.writeFile(path.join(updateDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log("Update package created successfully!");
}

packageUpdate().catch(console.error);
