import Reveal from './Reveal';

export default function Intro() {
  return (
    <section className="intro">
      <Reveal className="intro__inner">
        <div className="mono">A small note on how we work</div>
        <p className="intro__quote">
          We don't direct your day.<br />
          We <em>follow</em> it — quietly, closely, the way you'd want your
          grandmother to remember it.
        </p>
        <div className="intro__by">— Ada · founder & lead photographer</div>
        <div className="thread" aria-hidden="true"><span className="knot" /></div>
      </Reveal>
    </section>
  );
}
