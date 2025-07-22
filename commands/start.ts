import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import { green } from "https://deno.land/std@0.224.0/fmt/colors.ts";

const HOME = Deno.env.get("HOME") ?? "~";
const DATA_DIR = join(HOME, ".timr");
const CURRENT_FILE = join(DATA_DIR, "current.json");

export async function start() {
  await ensureDir(DATA_DIR);

  try {
    await Deno.stat(CURRENT_FILE);
    console.log("⏲️  A timer is already running.");
    return;
  } catch (_) {
    // File does not exist — good to proceed
  }

  const nowUtc = new Date().toISOString();
  await Deno.writeTextFile(
    CURRENT_FILE,
    JSON.stringify({ start: nowUtc }, null, 2),
  );

  const localTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log(`🟢 Timer started at ${green(localTime)}`);
}
