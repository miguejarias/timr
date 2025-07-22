import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { formatDuration } from "../utils/date.ts";

const HOME = Deno.env.get("HOME") ?? "~";
const DATA_DIR = join(HOME, ".timr");
const CURRENT_FILE = join(DATA_DIR, "current.json");

export async function status() {
  try {
    const raw = await Deno.readTextFile(CURRENT_FILE);
    const session = JSON.parse(raw);
    const startTime = new Date(session.start);
    const now = new Date();

    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    console.log("🟢 Timer is running.");
    console.log(
      `Started at: ${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    );
    console.log(`Elapsed: ${formatDuration(elapsed)}`);
  } catch {
    console.log("🟡 No active timer.");
  }
}
