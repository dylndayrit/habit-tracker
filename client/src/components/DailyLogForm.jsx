export default function DailyLogForm({ habits, logs, createLog, deleteLog }) {
  const today = new Date().toISOString().slice(0,10);
  const todayByHabit = new Map();
  for (const l of logs) {
    if (l.date_logged === today) todayByHabit.set(l.habit_id, l);
  }

  async function toggle(habitId) {
    const existing = todayByHabit.get(habitId);
    if (existing) {
      await deleteLog(existing.id);
    } else {
      await createLog({ habit_id: habitId, date_logged: today, status: "done" });
    }
  }

  return (
    <div className="card">
      <h2>Log Habits Today ({today})</h2>
      <ul style={{ listStyle:"none", padding:0 , alignItems: "start"}}>
        {habits.map(h => (
          <li key={h.id} className = "logItem">
            <input
              type="checkbox"
              checked={todayByHabit.has(h.id)}
              onChange={() => toggle(h.id)}
            />
            <div className = "logContent">
              <div className = "bodyBold">{h.title}</div>
              <div className = "bodyText">{h.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
