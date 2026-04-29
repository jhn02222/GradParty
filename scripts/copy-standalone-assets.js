const fs = require("fs");
const path = require("path");

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");

function copyDir(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(destination, { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

if (!fs.existsSync(standaloneDir)) {
  console.warn("Standalone build directory was not found; skipping asset copy.");
  process.exit(0);
}

copyDir(path.join(root, ".next", "static"), path.join(standaloneDir, ".next", "static"));
copyDir(path.join(root, "public"), path.join(standaloneDir, "public"));

console.log("Copied Next static assets into the standalone build.");
