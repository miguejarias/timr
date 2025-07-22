import { ensureDir } from "https://deno.land/std@0.224.0/fs/mod.ts";
import * as clippy from "https://deno.land/x/clippy/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { collectLogs } from "../utils/logs.ts";
import {
  cyan,
  yellow,
  green,
} from "https://deno.land/std@0.224.0/fmt/colors.ts";

const SUMMARY_DIR = join(Deno.env.get("HOME") ?? ".", ".timr", "summaries");

export async function summary(args: any): Promise<void> {
  const { startDate, endDate } = parseDateRange(args);
  const refresh = args["refresh"] ?? false;
  const matchAll = args["match-all"] ?? false;

  const categoryArg = args["categories"] as string | undefined;
  const categories =
    categoryArg
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean) ?? [];

  await ensureDir(SUMMARY_DIR);

  const cachePath = buildCachePath(startDate, endDate, categories, matchAll);
  const cacheExists = await fileExists(cachePath);

  if (cacheExists && !refresh) {
    const cached = await Deno.readTextFile(cachePath);
    console.log();
    console.log(yellow("🧠 Cached summary found:"));
    console.log(cached);
    await clippy.writeText(cached);
    console.log();
    console.log(cyan("📋 Copied to clipboard!"));
    console.log();
    return;
  }

  const logs = await collectLogs(startDate, endDate, categories, matchAll);

  if (logs.length === 0) {
    console.log(yellow("📭 No logs found for given filters."));
    return;
  }

  const prompt = buildPrompt(logs);
  const result = await callOpenAI(prompt);

  await Deno.writeTextFile(cachePath, result);

  console.log();
  console.log(green("🤖 AI Summary:"));
  console.log(result);
  await clippy.writeText(result);
  console.log();
  console.log(cyan("📋 Copied to clipboard!"));
  console.log();
}

function buildCachePath(
  start: Date,
  end: Date,
  categories: string[],
  matchAll: boolean,
): string {
  const slug = categories.length
    ? categories.map((c) => c.toUpperCase()).join("-")
    : "ALL";
  const mode = matchAll ? "match-all" : "match-any";
  const file = `${start.toISOString().split("T")[0]}_to_${end.toISOString().split("T")[0]}_${slug}_${mode}.txt`;
  return join(SUMMARY_DIR, file);
}

function buildPrompt(logs: any[]): string {
  const text = logs
    .map((entry) => {
      const start = new Date(entry.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const end = new Date(entry.end).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `- ${start} to ${end}: ${entry.desc}`;
    })
    .join("\n");

  return `I am a software developer preparing to give an update on the work I've done. Based on the following time-tracked session logs, summarize my work in 3-4 concise, human-friendly sentences. Make it sound like its coming from me. Dont add unecessary details or fluff like "This was a productive day for me" etc\n\n${text}`;
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY not set in environment");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates human-friendly summaries for a software developer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI Error: ${errorText}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "⚠️ No response from OpenAI.";
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isFile;
  } catch (_) {
    return false;
  }
}

function parseDateRange(args: any): { startDate: Date; endDate: Date } {
  const today = new Date();
  const from = args.from ? new Date(args.from as string) : null;
  const to = args.to ? new Date(args.to as string) : null;
  const date = args.date ? new Date(args.date as string) : null;
  const yesterday = args.yesterday;
  const week = args.week;
  const month = args.month;

  let startDate = today;
  let endDate = today;

  if (date) {
    startDate = endDate = date;
  } else if (yesterday) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    startDate = endDate = y;
  } else if (week) {
    const first = today.getDate() - today.getDay() + 1;
    startDate = new Date(today.setDate(first));
    endDate = new Date(today.setDate(first + 6));
  } else if (month) {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (from && to) {
    startDate = from;
    endDate = to;
  }

  return { startDate, endDate };
}
