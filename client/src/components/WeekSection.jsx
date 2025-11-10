export default function WeekSection({ title, children }) {
  return (
    <section className="card" style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 16 }}>{title}</h2>
      {children}
    </section>
  );
}
