export async function writeToClipboard(text: string): Promise<void> {
  const platform = Deno.build.os;

  try {
    if (platform === "darwin") {
      const p = Deno.run({
        cmd: ["pbcopy"],
        stdin: "piped",
      });
      const writer = p.stdin.getWriter();
      await writer.write(new TextEncoder().encode(text));
      writer.close();
      await p.status();
      p.close();
    } else if (platform === "windows") {
      const p = Deno.run({
        cmd: ["clip"],
        stdin: "piped",
      });
      const writer = p.stdin.getWriter();
      await writer.write(new TextEncoder().encode(text));
      writer.close();
      await p.status();
      p.close();
    } else {
      const p = Deno.run({
        cmd: ["xclip", "-selection", "clipboard"],
        stdin: "piped",
      });
      const writer = p.stdin.getWriter();
      await writer.write(new TextEncoder().encode(text));
      writer.close();
      await p.status();
      p.close();
    }
  } catch (e: any) {
    console.error("⚠️ Could not copy to clipboard:", e.message);
  }
}
