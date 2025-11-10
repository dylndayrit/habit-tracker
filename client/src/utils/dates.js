export function toISO(d) {
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10);
}
export function startOfWeekISO(d=new Date()) {
  const day = d.getDay(); // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
  return toISO(m);
}
export function daysOfWeekISO(startISO) {
  const base = new Date(`${startISO}T00:00:00`);
  return Array.from({length:8}, (_,i)=> {
    const x = new Date(base);
    x.setDate(base.getDate()+i);
    return toISO(x);
  });
}
export function toISOLocal(d) {
  // keep local date (avoids timezone shifts)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export function lastNDaysISO(n, includeToday = true) {
  // returns array like [today, -1d, -2d, ...]
  const startOffset = includeToday ? 0 : 1; // 0 includes today
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + startOffset));
    return toISOLocal(d);
  });
}

