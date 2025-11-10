export default function WeekView({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {children}
    </div>
  );
}
