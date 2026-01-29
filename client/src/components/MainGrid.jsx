export default function MainGrid({ left, right }) {
  return (
    <section className = "MainGrid">
      <div style={{display: "grid", justifyItems: "stretch", alignItems: "stretch"}}>{left}</div>
      <div style={{display: "grid", justifyItems: "stretch", alignItems: "stretch"}}>{right}</div>
    </section>
  );
}
