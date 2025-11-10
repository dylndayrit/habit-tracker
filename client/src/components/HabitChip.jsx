export default function HabitChip({ text, state = "default", onClick }) {
  const bg = state === "done" ? "#b7f7c3" : state === "skipped" ? "#f6bab4ff" : "#e6f0ff";
  return (
    <button onClick={onClick} style={{
      background: bg, border: "1px solid #ccc", borderRadius: 16, padding: "6px 10px",
      fontSize: 12, cursor: "pointer"
    }}>
      {text}
    </button>
  );
}
