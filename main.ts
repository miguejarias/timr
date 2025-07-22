import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import showHelp from "./utils/help.ts";

import { start } from "./commands/start.ts";
import { stop } from "./commands/stop.ts";
import { log } from "./commands/log.ts";
import { status } from "./commands/status.ts";
import { summary } from "./commands/summary.ts";

const args = parse(Deno.args);
const command = args._[0]?.toString();

switch (command) {
  case "start":
    await start();
    break;
  case "stop":
    await stop();
    break;
  case "status":
    await status();
    break;
  case "log":
    await log(args);
    break;
  case "summary":
    await summary(args);
    break;
  case "help":
  default:
    showHelp();
    break;
}
