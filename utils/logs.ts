import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

export interface LogEntry {
  start: string;
  end: string;
  desc: string;
  categories: string[];
}

export async function collectLogs(
  startDate: Date,
  endDate: Date,
  categories: string[],
  matchAll: boolean,
): Promise<LogEntry[]> {
  const logs: LogEntry[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const fileName = `${d.toISOString().split("T")[0]}.json`;
    const logPath = join(Deno.env.get("HOME")!, ".timr", fileName);

    try {
      const fileContent = await Deno.readTextFile(logPath);
      const entries: LogEntry[] = JSON.parse(fileContent);

      for (const entry of entries) {
        const entryCats = entry.categories || [];

        const keep =
          categories.length === 0
            ? true
            : matchAll
              ? categories.every((cat) => entryCats.includes(cat))
              : categories.some((cat) => entryCats.includes(cat));

        if (keep) logs.push(entry);
      }
    } catch {
      continue; // silently skip missing or bad files
    }
  }

  return logs;
}
