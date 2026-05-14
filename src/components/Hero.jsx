export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__top reveal">
        <div className="mono">foreverknots · est. 2020 · Kolkata</div>
        <div className="mono">№ 01 — A Wedding-Day Studio</div>
      </div>
      <div className="hero__inner">
        <div>
          <h1 className="hero__title reveal" data-delay="1">
            Love, kept<br />
            in <em>light</em>.
          </h1>
          <p className="hero__sub reveal" data-delay="2">
            A small wedding-photography studio out of Kolkata. We photograph the
            quiet half-second between things — the look just before the vow,
            the laugh in the middle of the haldi, the moment your grandmother
            holds your face.
          </p>
          <div className="hero__meta reveal" data-delay="3">
            <div>
              Based in
              <strong>Kolkata, India</strong>
            </div>
            <div>
              Travelling to
              <strong>Bhubaneswar · Ranchi · Varanasi · Kashmir</strong>
            </div>
            <div>
              Now booking
              <strong>2026 / 2027</strong>
            </div>
          </div>
        </div>

        <div className="collage reveal" data-delay="2">
          <div className="collage__tile collage__tile--main">
            <img src="/photos/p15.jpg" alt="Couple on heritage staircase" loading="eager" />
          </div>
          <div className="collage__tile collage__tile--tr">
            <img src="/photos/p18.jpg" alt="Bengali bride" loading="eager" />
          </div>
          <div className="collage__tile collage__tile--br">
            <img src="/photos/p05.jpg" alt="Couple running near Howrah Bridge" loading="eager" />
          </div>
          <div className="collage__stamp">
            tying knots since
            <em>2020</em>
          </div>
        </div>
      </div>
    </section>
  );
}
