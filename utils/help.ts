import {
  bold,
  cyan,
  green,
  yellow,
} from "https://deno.land/std@0.224.0/fmt/colors.ts";

export default function showHelp() {
  console.log("");
  console.log(
    bold(yellow("timr – lightweight CLI to track your work sessions 🛠️")),
  );
  console.log("");
  console.log(cyan("Usage:"));
  console.log("  timr <command> [options]");
  console.log("");
  console.log(cyan("Commands:"));
  console.log(`  start                  ${green("# Start tracking time")}`);
  console.log(`  stop                   ${green("# Stop and log time")}`);
  console.log(
    `  status                 ${green("# Show if a timer is running and how long")}`,
  );
  console.log(`  log                    ${green("# Show logged sessions")}`);
  console.log(
    `  summary                ${green("# Generate AI-powered standup summary")}`,
  );
  console.log("");
  console.log(cyan("Log Options:"));
  console.log(`  --yesterday            ${green("# Show logs for yesterday")}`);
  console.log(
    `  --date=YYYY-MM-DD      ${green("# Show logs for a specific date")}`,
  );
  console.log(
    `  --week                 ${green("# Show logs for the current week")}`,
  );
  console.log(
    `  --month                ${green("# Show logs for the current month")}`,
  );
  console.log(
    `  --from=YYYY-MM-DD      ${green("# Start of custom date range")}`,
  );
  console.log(
    `  --to=YYYY-MM-DD        ${green("# End of custom date range")}`,
  );
  console.log(
    `  --categories=fix,...   ${green("# Filter by one or more categories")}`,
  );
  console.log(
    `  --match-all            ${green("# Require all categories to match (AND logic)")}`,
  );
  console.log("");
  console.log(cyan("Summary Options:"));
  console.log(
    `  --refresh              ${green("# Force a new summary from OpenAI, ignore cache")}`,
  );
  console.log(`  --yesterday            ${green("# Summary for yesterday")}`);
  console.log(
    `  --date=YYYY-MM-DD      ${green("# Summary for a specific date")}`,
  );
  console.log(
    `  --week                 ${green("# Summary for the current week")}`,
  );
  console.log(
    `  --month                ${green("# Summary for the current month")}`,
  );
  console.log(
    `  --from=YYYY-MM-DD      ${green("# Start of custom date range")}`,
  );
  console.log(
    `  --to=YYYY-MM-DD        ${green("# End of custom date range")}`,
  );
  console.log(
    `  --categories=fix,...   ${green("# Filter by one or more categories")}`,
  );
  console.log(
    `  --match-all            ${green("# Require all categories to match (AND logic)")}`,
  );
  console.log("");
  console.log(cyan("General Flags:"));
  console.log(`  --no-color             ${green("# Disable colored output")}`);
  console.log("");
  console.log(green("Examples:"));
  console.log("  timr start");
  console.log("  timr stop");
  console.log("  timr log --week --categories=devops");
  console.log("  timr summary --today");
  console.log(
    "  timr summary --from=2025-07-01 --to=2025-07-15 --categories=bugfix,devops",
  );
  console.log("");
}
