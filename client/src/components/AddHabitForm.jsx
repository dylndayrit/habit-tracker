import { useState } from "react";

export default function AddHabitForm({ onCreate, defaultUserId = 1 }) {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [frequency, setFreq] = useState("daily");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await onCreate({
        user_id: defaultUserId,
        title: title.trim(),
        description: description.trim(),
        frequency,
      });
      setTitle(""); setDesc(""); setFreq("daily");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{ gap: 10 }}>
      <h2>Add Habit</h2>
      {err && <div style={{ color:"#b00" }}>{err}</div>}

      <div className = "bodyBold"> Title</div>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />

      <div className = "bodyBold"> Description</div>
      <textarea value={description} onChange={e=>setDesc(e.target.value)} placeholder="Description" required />
      
      <div className = "bodyBold"> How often?</div>
      <select value={frequency} onChange={e=>setFreq(e.target.value)}>
        <option value="daily">daily</option>
        <option value="weekly">weekly</option>
        <option value="monthly">monthly</option>
      </select>
      <button disabled={busy}>{busy ? "Adding…" : "Add Habit"}</button>
    </form>
  );
}
