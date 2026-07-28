import { useNavigate } from 'react-router-dom';
import { INFO } from '../data';
import { waLink } from '../utils/whatsapp';

export default function Foot({ onJump }) {
  const navigate = useNavigate();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div>
            <div className="foot__brand">
              forever<em>knots</em>
            </div>
            <p className="foot__tagline">
              A wedding-photography studio out of Kolkata. Documentary, slow,
              and printed on paper. Tying knots since 2020.
            </p>
          </div>
          <div className="foot__col">
            <h5>Studio</h5>
            <ul>
              <li onClick={() => onJump('work')}>Work</li>
              <li onClick={() => onJump('stories')}>Stories</li>
              <li onClick={() => navigate('/gallery')}>Gallery</li>
              <li onClick={() => onJump('packages')}>Investment</li>
              <li onClick={() => onJump('about')}>About</li>
              <li onClick={() => onJump('faq')}>FAQ</li>
              <li onClick={() => onJump('contact')}>Inquire</li>
            </ul>
          </div>
          <div className="foot__col">
            <h5>Elsewhere</h5>
            <ul>
              <li><a href={INFO.instagram} target="_blank" rel="noopener noreferrer">Instagram {INFO.instagramHandle}</a></li>
              <li>
                <a
                  href={waLink(INFO.phone, "Hi foreverknots! We're planning our wedding and would love to talk about photography.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>
              </li>
              <li><a href={`mailto:${INFO.email}`}>{INFO.email}</a></li>
              <li>{INFO.phone}</li>
            </ul>
          </div>
        </div>
        <div className="foot__bot">
          <span>© foreverknots · Kolkata</span>
          <nav className="foot__legal">
            <button type="button" onClick={() => navigate('/privacy')}>Privacy</button>
          </nav>
          <span>Made with care</span>
        </div>
      </div>
    </footer>
  );
}
