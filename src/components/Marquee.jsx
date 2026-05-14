const WORDS = [
  'Kolkata', 'Bhubaneswar', 'Ranchi', 'Varanasi', 'Kashmir',
  'Pre-Weddings', 'Bengali Weddings', 'Destinations', 'Heirloom Albums',
];

function Row({ id }) {
  return (
    <span key={id}>
      {WORDS.map((w, i) => (
        <span key={i}>
          {w}
          {i < WORDS.length - 1 && (
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-warm)', margin: '0 4px', verticalAlign: 'middle' }} />
          )}
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee__track">
        <Row id="a" /><Row id="b" />
      </div>
    </div>
  );
}
