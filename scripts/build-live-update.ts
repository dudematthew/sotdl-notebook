import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const BUILD_DIR = "dist";
const UPDATES_DIR = "../crm-web/public/live-updates";
const CHANNEL = process.env.NODE_ENV === "development" ? "development" : "production";

async function buildLiveUpdate() {
  // Build the web assets
  execSync("pnpm build", { stdio: "inherit" });

  // Ensure updates directory exists
  const channelDir = path.join(UPDATES_DIR, CHANNEL);
  fs.mkdirSync(channelDir, { recursive: true });

  // Create manifest
  const manifest = {
    version: new Date().getTime().toString(),
    files: [],
    url: `live-updates/${CHANNEL}/bundle.zip`,
  };

  // Create zip bundle of dist directory
  execSync(`cd ${BUILD_DIR} && zip -r ../bundle.zip ./*`);

  // Move bundle to updates directory
  fs.renameSync("bundle.zip", path.join(channelDir, "bundle.zip"));

  // Save manifest
  fs.writeFileSync(path.join(channelDir, "manifest.json"), JSON.stringify(manifest, null, 2));
}

buildLiveUpdate().catch(console.error);
