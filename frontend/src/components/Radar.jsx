export function Radar() {
  return (
    <section className="radar">
      <div>
        <h1>MAPA DEL TIEMPO ESPAÑA</h1>
        <a href="#busqueda">Consultar predicción</a>
      </div>
      <img
        className="radarImg"
        src="/api/aemet/red/radar/nacional"
        alt="Radar AEMET"
      />
    </section>
  );
}
