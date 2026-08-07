import { execSync } from "node:child_process";

const trackedFiles = execSync("git ls-files", {
  encoding: "utf8",
})
  .split(/\r?\n/)
  .map((file) => file.trim())
  .filter(Boolean);

const disallowedFiles = trackedFiles.filter(
  (file) => file.startsWith(".env") && !file.endsWith(".example"),
);

if (disallowedFiles.length > 0) {
  console.error("Tracked environment files must be examples only.");
  for (const file of disallowedFiles) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Tracked environment files are limited to examples.");