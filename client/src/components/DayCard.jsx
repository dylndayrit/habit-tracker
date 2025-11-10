// export default function DayCard({ label, children }) {
//   return (
//     <div className="card" style={{ minHeight: 120 }}>
//       <div className="bodyBold">{label}</div>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
//     </div>
//   );
// }
// DayCard.jsx
// export default function DayCard({ dateISO, children }) {
//   // safer parsing (keeps it at local midnight)
//   const d = new Date(`${dateISO}T00:00:00`);

//   const weekday = d.toLocaleDateString(undefined, { weekday: "long" });     // e.g., "Monday"
//   const monthDay = d.toLocaleDateString(undefined, { month: "short", day: "numeric" }); // e.g., "Nov 10"

//   const isToday = dateISO === new Date().toISOString().slice(0, 10);

//   return (
//     <div
//       className="card"
//       style={{
//         minHeight: 120,
//         border: isToday ? "2px solid #2563eb" : "1px solid #e5e7eb",
//         boxShadow: isToday ? "0 0 0 3px rgba(37,99,235,.15)" : "0 4px 14px rgba(0,0,0,.08)",
//       }}
//       aria-current={isToday ? "date" : undefined}
//       title={dateISO}
//     >
//       <div className="bodyBold" style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
//         <span>{weekday}</span>
//         <span style={{ opacity: 0.7 }}>• {monthDay}</span>
//       </div>

//       <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// DayCard.jsx
export default function DayCard({ dateISO, children }) {
  // local midnight to avoid TZ surprises
  const d = new Date(`${dateISO}T00:00:00`);
  const weekday = d.toLocaleDateString(undefined, { weekday: "long" });
  const monthDay = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const isToday = dateISO === new Date().toISOString().slice(0, 10);

  return (
    <div
      className="card"
      style={{
        minHeight: 120,
        border: isToday ? "2px solid #2563eb" : "1px solid #e5e7eb",
        boxShadow: isToday ? "0 0 0 3px rgba(37,99,235,.15)" : "0 4px 14px rgba(0,0,0,.08)",
      }}
      aria-current={isToday ? "date" : undefined}
      title={dateISO}
    >
      <div className="bodyBold" style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
        <span>{weekday}</span>
        <span style={{ opacity: 0.7 }}>• {monthDay}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
    </div>
  );
}



