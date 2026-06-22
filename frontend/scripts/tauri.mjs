import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const frontendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDirectory = path.resolve(frontendDirectory, "..");
const executable = process.platform === "win32" ? "tauri.cmd" : "tauri";
const cli = path.join(frontendDirectory, "node_modules", ".bin", executable);
const result = spawnSync(cli, process.argv.slice(2), {
  cwd: projectDirectory,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
