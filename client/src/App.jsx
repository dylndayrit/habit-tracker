import { useState, useEffect } from 'react'
import './App.css'
import { api } from "./api";
import { startOfWeekISO, daysOfWeekISO, toISOLocal, lastNDaysISO } from "./utils/dates";

import Header from "./components/Header.jsx";
import DailyLogForm from './components/DailyLogForm.jsx';
import AddHabitForm from './components/AddHabitForm.jsx';
import SideImage from './components/SideImage.jsx';
import MainGrid from './components/MainGrid.jsx';
import WeekSection from './components/WeekSection.jsx';
import WeekView from './components/WeekView.jsx';
import DayCard from './components/DayCard.jsx';
import HabitChip from './components/HabitChip.jsx';

function App() {

  const [habits, setHabits] = useState([]);
  const[logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // week view data
  const start = startOfWeekISO(new Date());
  const days = [toISOLocal(new Date()), ...lastNDaysISO(7, /* includeToday */ false)];

  // Load on mount
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true); setErr("");
        const [h, l] = await Promise.all([
          api.listHabits({ signal: ac.signal }),
          api.listLogs({ signal: ac.signal }),
        ]);
        setHabits(h);
        setLogs(l);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // functions
  async function createHabit(payload) {
    const created = await api.createHabit(payload);
    setHabits(prev => [created, ...prev]);
  }

  async function createLog(payload) {
    const created = await api.createLog(payload);
    setLogs(prev => [created, ...prev]);
  }

  async function updateHabit(id, patch) {
    const updated = await api.updateHabit(id, patch);
    setHabits(prev => prev.map(h => (h.id === id ? updated : h)));
  }

  async function updateLog(id, patch) {
    const updated = await api.updateLog(id, patch);
    setLogs(prev => prev.map(l => (l.id === id ? updated: l)));
  }

  async function deleteHabit(id) {
    await api.deleteHabit(id);
    setHabits(prev => prev.filter(h => (h.id !== id)));
    setLogs(prev => prev.filter(l => (l.habit_id !== id)));
  }

  async function deleteLog(id) {
    await api.deleteLog(id);
    setLogs(prev => prev.filter(l => (l.id !== id)));
  }

  return (
      <div>
        <Header />
        
        <MainGrid 

          left = {<DailyLogForm
            habits={habits}
            logs={logs}
            createLog={createLog}
            deleteLog={deleteLog} 
          />}

          center = {<AddHabitForm onCreate={createHabit} defaultUserId={1}/>}
          
          right = {<SideImage src={'/menacing-cat.gif'}/>}
        
        />
        
        <WeekSection title="Habit Logs This Week">
          <WeekView>
                    {/* {days.map((iso) => (
              <DayCard key={iso} dateISO={iso}>
                {habits.map((h) => {
                  const done = logs.some(
                    (l) => l.habit_id === h.id && l.date_logged === iso && l.status === "done"
                  );
                  return (
                    <HabitChip
                      key={`${iso}-${h.id}`}
                      text={h.title}
                      state={done ? "done" : "default"}
                      onClick={() =>
                        createLog({ habit_id: h.id, date_logged: iso, status: "done" })
                      }
                    />
                  );
                })}
              </DayCard>
            ))} */}
                {days.map((iso) => (
                <DayCard key={iso} dateISO={iso}>
                  {habits.map((h) => {
                    const done = logs.some(
                      (l) => l.habit_id === h.id && l.date_logged === iso && l.status === "done"
                    );
                    return (
                      <HabitChip
                        key={`${iso}-${h.id}`}
                        text={h.title}
                        state={done ? "done" : "default"}
                        onClick={() =>
                          createLog({ habit_id: h.id, date_logged: iso, status: "done" })
                        }
                      />
                    );
                  })}
                </DayCard>
              ))}
          </WeekView>
        </WeekSection>
        
      </div>
        

  );
}

export default App
