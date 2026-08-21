import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = path.join(projectRoot, "node_modules/scratchblocks");
const vendorDirectory = path.join(projectRoot, "public/vendor");

await mkdir(vendorDirectory, { recursive: true });
await Promise.all([
  copyFile(path.join(packageRoot, "build/scratchblocks.min.js"), path.join(vendorDirectory, "scratchblocks.min.js")),
  copyFile(path.join(packageRoot, "LICENSE"), path.join(vendorDirectory, "scratchblocks-LICENSE.txt")),
]);

console.log("Prepared scratchblocks 3.7.1 browser files.");
