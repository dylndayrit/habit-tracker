import { useState } from "react";
import Dropdown from "./Dropdown";

export default function DailyLogForm({ habits, logs, createLog, deleteLog }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayByHabit = new Map();
  for (const l of logs) {
    if (l.date_logged === today) todayByHabit.set(l.habit_id, l);
  }

  const [openDropdowns, setOpenDropdowns] = useState({});

  const handleOpen = (habitId) => {
    setOpenDropdowns((prev) => ({ ...prev, [habitId]: !prev[habitId] }));
  };

  async function toggle(habitId) {
    const existing = todayByHabit.get(habitId);
    if (existing) {
      await deleteLog(existing.id);
    } else {
      await createLog({ habit_id: habitId, date_logged: today, status: "done" });
    }
  }

  return (
    <div className="card" style={{ gap: 10, alignSelf: "stretch", justifySelf: "stretch"}}>

      <div>
        <h2>Log Habits Today ({today})</h2>
      </div>
      
      <ul style={{ listStyle: "none", padding: 0, alignItems: "start", margin:"none" }}>
        {habits.map((h) => (
          <li key={h.id} className="logItem">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <input
                  type="checkbox"
                  checked={todayByHabit.has(h.id)}
                  onChange={() => toggle(h.id)}
                />
                <div className="logContent">
                  <div className = "compactLog">
                    <div className="bodyBold">{h.title}</div>
                    <Dropdown open={!!openDropdowns[h.id]} onClick={() => handleOpen(h.id)} />
                  </div>
                  <div>
                    {openDropdowns[h.id] ? (
                      <div className="logDescription">
                        <div className="bodyText">{h.description}</div>
                      </div>
                    ) : null} 
                  </div>
                    
                </div>
                </div>
                
              </div>
              
          </li>
        ))}
      </ul>
    </div>
  );
}
