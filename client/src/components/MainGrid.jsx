export default function MainGrid({ left, center, right }) {
  return (
    <section className = "MainGrid">
      <div >{left}</div>
      <div >{center}</div>
      <div>{right}</div>
    </section>
  );
}
