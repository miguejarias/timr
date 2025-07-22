import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import {
  green,
  yellow,
  cyan,
} from "https://deno.land/std@0.224.0/fmt/colors.ts";
import {
  parseDateArgRange,
  getLogDatesInRange,
  formatDuration,
  formatDatePretty,
} from "../utils/date.ts";

const HOME = Deno.env.get("HOME") ?? "~";
const DATA_DIR = join(HOME, ".timr");

export async function log(args: Record<string, unknown>) {
  const { startDate, endDate } = parseDateArgRange(args);

  const rawCats = args["categories"] as string | undefined;
  const categories =
    rawCats
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean) ?? [];

  const matchAll = !!args["match-all"];

  const isSingleDay = startDate.getTime() === endDate.getTime();

  const allDates = getLogDatesInRange(startDate, endDate);
  let anyPrinted = false;

  for (const date of allDates) {
    const filename = join(DATA_DIR, `${date.toISOString().split("T")[0]}.json`);

    let entries: any[];
    try {
      const raw = await Deno.readTextFile(filename);
      entries = JSON.parse(raw);
    } catch {
      if (isSingleDay) {
        console.log(`📭 No logs found for ${date.toISOString().split("T")[0]}`);
      }
      continue;
    }

    const filtered = entries.filter((entry: any) => {
      const entryCats = entry.categories ?? [];

      if (categories.length === 0) return true;

      if (matchAll) {
        return categories.every((cat) => entryCats.includes(cat));
      } else {
        return categories.some((cat) => entryCats.includes(cat));
      }
    });

    if (filtered.length === 0) {
      if (isSingleDay) {
        console.log(`📭 No logs found for ${date.toISOString().split("T")[0]}`);
      }
      continue;
    }

    anyPrinted = true;

    console.log("-".repeat(25));
    console.log(yellow(`📅 ${formatDatePretty(date)}`));

    let totalSec = 0;

    for (const entry of filtered) {
      const start = new Date(entry.start);
      const end = new Date(entry.end);
      const duration = (end.getTime() - start.getTime()) / 1000;
      totalSec += duration;

      const startStr = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endStr = end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const desc = entry.desc;
      const cats = entry.categories ?? [];
      const catLabel = cats.length > 0 ? cyan(`[${cats.join(", ")}]`) : "";

      console.log(
        `${green(startStr)} → ${green(endStr)} | ${desc} ${catLabel}`,
      );
    }

    console.log(yellow(`🕒 Total: ${formatDuration(totalSec)}`));
    console.log("-".repeat(25));
  }

  if (!anyPrinted && !isSingleDay) {
    console.log("📭 No logs found in this range.");
  }
}
