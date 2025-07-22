export function parseDateArgRange(args: Record<string, unknown>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (args["yesterday"]) {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return { startDate: y, endDate: y };
  }

  if (args["date"]) {
    const d = new Date(String(args["date"]));
    return { startDate: d, endDate: d };
  }

  if (args["week"]) {
    const monday = new Date(today);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { startDate: monday, endDate: sunday };
  }

  if (args["month"]) {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { startDate: first, endDate: last };
  }

  if (args["from"] && args["to"]) {
    const from = new Date(String(args["from"]));
    const to = new Date(String(args["to"]));
    return { startDate: from, endDate: to };
  }

  return { startDate: today, endDate: today };
}

export function getLogDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function formatDatePretty(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
