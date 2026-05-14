export default function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head__meta reveal">
            <div className="mono">On the photographer</div>
            <h2 className="sec-head__title">
              Hello — we're a <em>small studio</em><br />out of Kolkata.
            </h2>
          </div>
          <p className="sec-head__lead reveal" data-delay="1">
            foreverknots is a five-year-old wedding photography practice. We work
            in pairs — one camera close in, one stepped back — and we believe
            the best wedding photographs are the ones nobody noticed being taken.
          </p>
        </div>

        <div className="about-grid">
          <div className="about__media reveal" data-delay="1">
            <img src="/photos/p25.jpg" alt="The photographer at work" />
          </div>
          <div className="about__body reveal" data-delay="2">
            <p>
              We started in 2020, the year nobody got married. The weddings we
              did photograph that year were small — five guests, two photographers,
              a quiet ceremony in a sitting room. We learned to work without an
              audience. We never quite stopped.
            </p>
            <p>
              Today we photograph across Bengal and well beyond — Bhubaneswar,
              Ranchi, Varanasi, Kashmir — for couples who want something more
              honest than a posed reel. Our work is documentary first, with a
              few deliberate portraits when the light is generous. We shoot on
              digital, finish in a slow, film-leaning palette, and deliver an
              heirloom album you'll pass on, not a Google Drive link you'll lose.
            </p>
            <p>
              Above everything, we believe a wedding day is not a performance.
              It's a long, slightly chaotic, deeply specific Tuesday. We are
              here to remember it for you.
            </p>
            <div className="about__sig">— the foreverknots studio</div>

            <div className="about__stats">
              <div className="about__stat">
                <div className="num">80<em>+</em></div>
                <div className="label">Weddings photographed</div>
              </div>
              <div className="about__stat">
                <div className="num">12</div>
                <div className="label">Cities, five states</div>
              </div>
              <div className="about__stat">
                <div className="num">5<em> yrs</em></div>
                <div className="label">Quietly in practice</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
