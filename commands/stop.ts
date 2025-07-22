import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { cyan } from "https://deno.land/std@0.224.0/fmt/colors.ts";

const HOME = Deno.env.get("HOME") ?? "~";
const DATA_DIR = join(HOME, ".timr");
const CURRENT_FILE = join(DATA_DIR, "current.json");

export async function stop() {
  try {
    await Deno.stat(CURRENT_FILE);
  } catch {
    console.log("⚠️  No active timer found. Run `timr start` first.");
    return;
  }

  const current = JSON.parse(await Deno.readTextFile(CURRENT_FILE));
  const startTime = new Date(current.start);
  const endTime = new Date();
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMin = Math.round(durationMs / 60000);

  // ─── Prompt for Description ─────────────────────────────────────
  let desc = "";
  while (!desc.trim()) {
    desc = prompt("✍️  What did you work on?") ?? "";
    if (!desc.trim()) {
      console.log("⚠️  Description is required to log time.");
    }
  }

  // ─── Prompt for Categories ──────────────────────────────────────
  const catInput =
    prompt("🏷  Optional categories? (comma-separated, e.g. bugfix,devops)") ??
    "";
  const categories = catInput
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  // ─── Write to Log File ──────────────────────────────────────────
  const dateStr = startTime.toISOString().split("T")[0];
  const logFile = join(DATA_DIR, `${dateStr}.json`);

  let entries: any[] = [];
  try {
    const raw = await Deno.readTextFile(logFile);
    entries = JSON.parse(raw);
  } catch {
    // file doesn't exist yet — no problem
  }

  entries.push({
    start: startTime.toISOString(),
    end: endTime.toISOString(),
    desc,
    categories,
  });

  await Deno.writeTextFile(logFile, JSON.stringify(entries, null, 2));

  // ─── Delete current session ─────────────────────────────────────
  await Deno.remove(CURRENT_FILE);

  // ─── Output Summary ─────────────────────────────────────────────
  const catLabel =
    categories.length > 0 ? cyan(`[${categories.join(", ")}]`) : "";
  const summary = `"${desc}" ${catLabel}`.trim();

  console.log(
    `✅ Logged: ${durationMin} minute${durationMin === 1 ? "" : "s"} — ${summary}`,
  );
}
