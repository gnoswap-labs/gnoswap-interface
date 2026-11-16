import { constants, openSync, fstatSync, readFileSync, closeSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";

const web = fileURLToPath(new URL("../", import.meta.url));

// Only these messages are safe to show; OS/parser errors can contain secrets.
class LaunchError extends Error {}

function readCredentials() {
  const file = join(web, ".env.local");
  let fd;
  try {
    fd = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  } catch (error) {
    if (error.code === "ENOENT") return {};
    if (error.code === "ELOOP") throw new LaunchError("packages/web/.env.local must not be a symlink.");
    throw new LaunchError("Cannot open packages/web/.env.local. Check its access permissions.");
  }
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.uid !== process.getuid() || (stat.mode & 0o777) !== 0o600) {
      throw new LaunchError("packages/web/.env.local must be an owned regular file with mode 0600.");
    }
    return parseEnv(readFileSync(fd, "utf8"));
  } catch (error) {
    if (error instanceof LaunchError) throw error;
    throw new LaunchError("Cannot read or parse packages/web/.env.local.");
  } finally {
    closeSync(fd);
  }
}

// Replace this process: the server/CLI owns its exit status and signals.
try {
  const [mode, ...args] = process.argv.slice(2);
  if (!["mcp", "pull"].includes(mode)) {
    throw new LaunchError("Usage: node packages/web/scripts/i18nexus.mjs mcp | pull [args...]");
  }
  if (!process.execve) throw new LaunchError("Node.js >=22.15 with process.execve is required. Use the version in .nvmrc.");
  const env = { ...process.env };
  const api = "I18NEXUS_API_KEY";
  const pat = "I18NEXUS_PERSONAL_ACCESS_TOKEN";
  delete env[api];
  delete env[pat];
  const help = mode === "pull" && args.some(arg => arg === "--help" || arg === "-h");
  if (!help) {
    const names = mode === "pull" ? [api] : [api, pat];
    const credentials = names.every(name => process.env[name]?.trim()) ? {} : readCredentials();
    for (const name of names) {
      const value = process.env[name]?.trim() ? process.env[name] : credentials[name];
      if (value?.trim()) env[name] = value;
    }
    if (!env[api]) {
      throw new LaunchError("Missing I18NEXUS_API_KEY. Set it in ENV or packages/web/.env.local.");
    }
  }
  if (mode === "pull") {
    env.I18NEXUS_NO_DOT_ENV = "true";
    process.chdir(web);
  }
  const require = createRequire(import.meta.url);
  const entry = require.resolve(mode === "pull" ? "i18nexus-cli/bin/index.js" : "@i18nexus/mcp");
  process.execve(process.execPath, [process.execPath, entry, ...(mode === "pull" ? ["pull", ...args] : args)], env);
} catch (error) {
  const message = error instanceof LaunchError
    ? error.message
    : "Cannot launch i18nexus. Run yarn install --immutable and check checkout file access.";
  console.error(`i18nexus: ${message}`);
  process.exitCode = 1;
}
