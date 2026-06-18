import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, ChevronRight, Menu, X,
  MapPin, Phone, Clock, Mail,
  Star, Award, Users, ShieldCheck, TrendingUp, Target, Activity,
  CheckCircle
} from 'lucide-react';

/* ─── useInView ─── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Reveal wrapper ─── */
function Reveal({
  children, delay = 0
}: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['Home', 'About', 'Services', 'Schedule', 'Reviews', 'Contact'];

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(17,17,17,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid #222' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 2rem', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#39FF14',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
          }}>
            <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.85rem', color: '#111' }}>SG</span>
          </div>
          <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.08em', color: '#fff', textTransform: 'uppercase' }}>
            SARK<span style={{ color: '#39FF14' }}>GYM</span>
          </span>
        </a>

        {/* Desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-item">{l}</a>
          ))}
          <a href="#contact" className="btn-lime" style={{ padding: '0.6rem 1.4rem', fontSize: '0.7rem' }}>
            JOIN NOW <ChevronRight size={13} />
          </a>
        </nav>

        {/* Mobile */}
        <button
          className="md:hidden"
          onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: '1px solid #333', color: '#fff', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div style={{ background: '#111', borderTop: '1px solid #222', padding: '1.5rem 2rem' }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{ display: 'block', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E5E2E3', textDecoration: 'none', padding: '0.9rem 0', borderBottom: '1px solid #1a1a1a' }}
            >{l}</a>
          ))}
          <a href="#contact" className="btn-lime" onClick={() => setOpen(false)} style={{ marginTop: '1.5rem', justifyContent: 'center', width: '100%' }}>
            JOIN NOW <ChevronRight size={13} />
          </a>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
function Hero() {
  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#111', overflow: 'hidden' }}>
      {/* BG image — full B&W high contrast */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="/images/hero-bg.jpg"
          alt="SARK GYM"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.3) brightness(0.28)' }}
        />
        {/* Brutal gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(95deg, rgba(17,17,17,0.96) 0%, rgba(17,17,17,0.7) 55%, rgba(17,17,17,0.3) 100%)' }} />
      </div>

      {/* Scanlines */}
      <div className="scanlines" />
      <div className="noise" />

      {/* Vertical accent line */}
      <div style={{ position: 'absolute', left: '0', top: 0, bottom: 0, width: '4px', background: '#39FF14', zIndex: 3 }} />

      {/* Large watermark text */}
      <div style={{
        position: 'absolute', right: '-2rem', bottom: '-2rem', zIndex: 1,
        fontFamily: 'Montserrat', fontWeight: 900, fontSize: 'clamp(8rem, 22vw, 18rem)',
        color: 'rgba(255,255,255,0.025)', lineHeight: 1, userSelect: 'none',
        letterSpacing: '-0.04em', textTransform: 'uppercase',
      }}>
        SARK
      </div>

      <div style={{ position: 'relative', zIndex: 4, maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', width: '100%', paddingTop: '96px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px' }}>
          {/* Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '2px', background: '#39FF14' }} />
            <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#39FF14' }}>
              #1 GYM IN DHANBAD · 5.0 ★ · 311 REVIEWS
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="glitch-wrap"
            data-text="NO LIMITS."
            style={{
              fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase',
              fontSize: 'clamp(3.5rem, 11vw, 9rem)', lineHeight: 0.9,
              letterSpacing: '-0.03em', color: '#fff',
              marginBottom: '0.3rem', display: 'block',
            }}
          >
            NO LIMITS.
          </h1>
          <h1 style={{
            fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase',
            fontSize: 'clamp(3.5rem, 11vw, 9rem)', lineHeight: 0.9,
            letterSpacing: '-0.03em', color: '#39FF14',
            marginBottom: '2.5rem',
          }}>
            NO EXCUSES.
          </h1>

          <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(229,226,227,0.7)', maxWidth: '460px', marginBottom: '2.5rem' }}>
            SARK GYM — Dhanbad's most intense training ground. Expert coaching,
            elite equipment, and a community built on sweat and results. Open 7 days.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem' }}>
            <a href="#contact" className="btn-lime">
              START TRAINING <ArrowRight size={16} />
            </a>
            <a href="#about" className="btn-outline-lime">
              EXPLORE THE GYM
            </a>
          </div>

          {/* Stat row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', paddingTop: '2.5rem', borderTop: '1px solid #222' }}>
            {[
              { val: 311, suffix: '+', label: 'MEMBERS' },
              { val: 5,   suffix: '.0★', label: 'RATING' },
              { val: 7,   suffix: '',   label: 'DAYS / WK' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '2.2rem', color: '#39FF14', lineHeight: 1 }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#555', marginTop: '6px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom info strip */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, background: 'rgba(0,0,0,0.75)', borderTop: '1px solid #1e1e1e' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '0.9rem 0' }}>
            {[
              { icon: <MapPin size={13} />, text: 'First Floor, Vinod Bihari Chowk, Bhuli, Dhanbad 826012' },
              { icon: <Phone size={13} />,  text: '+91 95602 06136' },
              { icon: <Clock size={13} />,  text: 'Mon – Sun · 06:00 AM – 10:00 AM' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter', fontSize: '0.75rem', color: '#666' }}>
                <span style={{ color: '#39FF14' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   TICKER
═══════════════════════════════════════════ */
function Ticker() {
  const base = ['TRAIN HARDER', 'NO DAYS OFF', 'PUSH YOUR LIMITS', 'DHANBAD\'S BEST', '5-STAR RATED', 'EXPERT COACHING', 'RESULTS GUARANTEED', 'JOIN THE MOVEMENT'];
  const items = [...base, ...base, ...base];
  return (
    <div style={{ background: '#39FF14', padding: '0.75rem 0', overflow: 'hidden', position: 'relative' }}>
      <div className="marquee-track" style={{ display: 'flex', gap: '3rem', width: 'max-content' }}>
        {items.map((item, i) => (
          <span key={i} style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#111', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {item}
            <span style={{ display: 'inline-block', width: '5px', height: '5px', background: '#111', transform: 'rotate(45deg)', opacity: 0.4 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════ */
function About() {
  return (
    <section id="about" style={{ background: '#111', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center' }}>

          {/* Image col */}
          <Reveal>
            <div style={{ position: 'relative' }}>
              <img
                src="/images/community.jpg"
                alt="SARK GYM community"
                style={{ width: '100%', objectFit: 'cover', height: '540px', filter: 'grayscale(100%) contrast(1.2)', display: 'block' }}
              />
              {/* Lime accent frame offset */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', right: '-16px', bottom: '-16px', border: '2px solid #39FF14', zIndex: -1 }} />
              {/* Stat box */}
              <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', background: '#39FF14', padding: '1.5rem 2rem' }}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '2.5rem', color: '#111', lineHeight: 1 }}>5.0</div>
                <div style={{ display: 'flex', gap: '3px', margin: '6px 0 4px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#111" style={{ color: '#111' }} />)}
                </div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#111', textTransform: 'uppercase' }}>311 REVIEWS</div>
              </div>
            </div>
          </Reveal>

          {/* Copy col */}
          <Reveal delay={120}>
            <div className="section-tag">ABOUT US</div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 0.95, color: '#fff', marginBottom: '1.8rem' }}>
              BUILT FOR<br /><span style={{ color: '#39FF14' }}>THOSE WHO</span><br />DON'T QUIT.
            </h2>
            <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.9, color: '#888', marginBottom: '1.2rem' }}>
              Located in Bhuli, Dhanbad — SARK GYM is not just a gym. It's a battleground where limits are broken daily. Led by Satish Sir and Chandan Sir, our coaches bring unmatched expertise and relentless drive to every single session.
            </p>
            <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.9, color: '#888', marginBottom: '2.5rem' }}>
              Whether you're just starting or chasing a PR, SARK GYM gives you the tools, the coaching, and the community to get there — every day, no excuses.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {[
                'Professional-grade equipment',
                'Expert coaching: Satish Sir',
                'Guided by Chandan Sir',
                'Spotless, maintained facility',
                'Intense community energy',
                '1.2 km from Bhuli Station',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={14} style={{ color: '#39FF14', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Inter', fontSize: '0.82rem', color: '#999' }}>{item}</span>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn-lime">
              BOOK A FREE VISIT <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   STATS BAND
═══════════════════════════════════════════ */
function StatsBand() {
  const stats = [
    { val: 311, suffix: '+', label: 'ACTIVE MEMBERS' },
    { val: 100, suffix: '%', label: 'DEDICATION' },
    { val: 7,   suffix: '',  label: 'DAYS A WEEK' },
    { val: 5,   suffix: '★', label: 'STAR RATING' },
  ];
  return (
    <div style={{ background: '#161616', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0' }}>
          {stats.map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{ borderRadius: 0, borderLeft: i > 0 ? '1px solid #222' : 'none', borderTop: 'none', borderBottom: 'none', borderRight: 'none' }}
            >
              <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '2.8rem', color: '#39FF14', lineHeight: 1, marginBottom: '0.4rem' }}>
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.25em', color: '#444', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════ */
function Services() {
  const svcs = [
    { icon: <Award size={24} />, title: 'EXPERT COACHING', desc: 'Satish Sir and Chandan Sir engineer your program for maximum output — form, intensity, and progression locked in.' },
    { icon: <TrendingUp size={24} />, title: 'STRENGTH TRAINING', desc: 'Full suite of barbells, machines, and cables. Every muscle group, every movement pattern, zero compromises.' },
    { icon: <Users size={24} />, title: 'GROUP SESSIONS', desc: "Accountability is fuel. Our group classes push every member past what they thought possible — together." },
    { icon: <Target size={24} />, title: 'GOAL PROGRAMS', desc: 'Fat loss, muscle gain, strength, endurance — structured progressive programs built around your specific target.' },
    { icon: <ShieldCheck size={24} />, title: 'CLEAN FACILITY', desc: 'Razor-clean equipment, maintained daily. You bring the sweat — we handle the rest.' },
    { icon: <Activity size={24} />, title: 'FUNCTIONAL FITNESS', desc: 'Real-world movement patterns. Build a body that performs, not just looks good. Train for life.' },
  ];

  return (
    <section id="services" style={{ background: '#111', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', marginBottom: '4rem' }}>
          <Reveal>
            <div>
              <div className="section-tag">WHAT WE OFFER</div>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em', lineHeight: 0.95, color: '#fff' }}>
                THE TOOLS TO<br /><span style={{ color: '#39FF14' }}>DOMINATE.</span>
              </h2>
            </div>
          </Reveal>
          <a href="#contact" className="btn-lime">JOIN TODAY <ArrowRight size={16} /></a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: '#1a1a1a' }}>
          {svcs.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="feat-card" style={{ height: '100%' }}>
                {/* Number label */}
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.6rem', letterSpacing: '0.22em', color: '#333', marginBottom: '1.5rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ width: '42px', height: '42px', background: 'rgba(57,255,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#39FF14' }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff', marginBottom: '0.8rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.85rem', lineHeight: 1.8, color: '#666' }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FULL-BLEED CTA
═══════════════════════════════════════════ */
function FullBleedCTA() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '480px', display: 'flex', alignItems: 'center' }}>
      <img
        src="/images/coaching.jpg"
        alt="Coaching at SARK GYM"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.25) brightness(0.22)' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(17,17,17,0.97) 40%, rgba(17,17,17,0.5) 100%)' }} />
      <div className="scanlines" />

      {/* Big diagonal text */}
      <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) rotate(-6deg)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 'clamp(5rem, 18vw, 13rem)', color: 'rgba(57,255,20,0.04)', userSelect: 'none', letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>
        COACHED
      </div>

      <div style={{ position: 'relative', zIndex: 5, maxWidth: '1280px', margin: '0 auto', padding: '5rem 2rem', width: '100%' }}>
        <div style={{ maxWidth: '560px' }}>
          <div className="section-tag">EXPERT-LED TRAINING</div>
          <h3 style={{ fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 0.95, color: '#fff', marginBottom: '1.5rem' }}>
            COACHED BY THE BEST.<br /><span style={{ color: '#39FF14' }}>BUILT FOR EVERYONE.</span>
          </h3>
          <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.8, color: '#777', marginBottom: '2rem' }}>
            Satish Sir and Chandan Sir bring elite expertise and a no-quit mentality to every session. Beginners, intermediate, advanced — all are forged here.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#contact" className="btn-lime">GET STARTED <ArrowRight size={15} /></a>
            <a href="#reviews" className="btn-outline-lime">MEMBER STORIES</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FACILITY
═══════════════════════════════════════════ */
function Facility() {
  return (
    <section style={{ background: '#0d0d0d', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>THE FACILITY</div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em', color: '#fff' }}>
              BUILT FOR<br /><span style={{ color: '#39FF14' }}>PERFORMANCE.</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <Reveal>
            <img src="/images/facility.jpg" alt="Facility" style={{ width: '100%', height: '400px', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.15)', display: 'block' }} />
          </Reveal>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '4px' }}>
            <Reveal delay={80}>
              <img src="/images/hero-bg.jpg" alt="Group training" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.15)', display: 'block' }} />
            </Reveal>
            <Reveal delay={160}>
              <div style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
                <img src="/images/community.jpg" alt="Community" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, filter: 'grayscale(100%) contrast(1.2) brightness(0.22)' }} />
                <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <p style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.6rem', textTransform: 'uppercase', color: '#fff', lineHeight: 1, marginBottom: '6px' }}>OPEN DAILY</p>
                  <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.2em', color: '#39FF14', textTransform: 'uppercase' }}>06:00 AM – 10:00 AM</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SCHEDULE
═══════════════════════════════════════════ */
function Schedule() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <section id="schedule" style={{ background: '#111', padding: '7rem 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>SCHEDULE</div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em', color: '#fff' }}>
              WE'RE OPEN.<br /><span style={{ color: '#39FF14' }}>EVERY. SINGLE. DAY.</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div style={{ border: '1px solid #222', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '1rem 2rem', background: '#39FF14' }}>
              {['DAY', 'OPENS', 'CLOSES'].map((h, i) => (
                <span key={h} style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.65rem', letterSpacing: '0.22em', color: '#111', textAlign: i === 1 ? 'center' : i === 2 ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>

            {days.map((day, i) => (
              <div
                key={day}
                className="time-row"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '1.1rem 2rem', alignItems: 'center', background: i % 2 === 0 ? '#111' : '#0e0e0e' }}
              >
                <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#E5E2E3' }}>{day}</span>
                <span style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>06:00 AM</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.15em', color: '#111', background: '#39FF14', padding: '2px 8px' }}>OPEN</span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#666' }}>10:00 AM</span>
                </div>
              </div>
            ))}

            <div style={{ padding: '0.75rem 2rem', background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
              <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#444' }}>* Last updated January 10, 2026.</p>
            </div>
          </div>
        </Reveal>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="tel:+919560206136" className="btn-white">
            <Phone size={14} /> CALL TO CONFIRM · +91 95602 06136
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   REVIEWS
═══════════════════════════════════════════ */
function Reviews() {
  const reviews = [
    {
      name: 'FARHAN FIROZ', initial: 'F', time: '32 MONTHS AGO',
      text: "It's been a couple of weeks at SARK GYM and my experience has been nothing short of excellent. The environment is perfectly set for serious training. Satish sir is always ready to correct, guide and push us. Equipment is top-notch and the place is clean. All I see is progress.",
    },
    {
      name: 'ATUL RANJAN', initial: 'A', time: '30 MONTHS AGO',
      text: "Incredible experience from day one. Wide range of high-quality equipment, an unmistakably motivating atmosphere, and Satish Bhaiya's guidance has been the difference-maker in my fitness journey. Absolute top-tier gym.",
    },
    {
      name: 'WALLART WALLPAPER', initial: 'W', time: '30 MONTHS AGO',
      text: "Best gym in Dhanbad, hands down. Satish sir is experienced, friendly, and genuinely invested in your progress. All facilities are excellent. Highly recommended to anyone serious about training.",
    },
  ];

  return (
    <section id="reviews" style={{ background: '#0d0d0d', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', marginBottom: '4rem' }}>
          <Reveal>
            <div>
              <div className="section-tag">TESTIMONIALS</div>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em', lineHeight: 0.95, color: '#fff' }}>
                REAL PEOPLE.<br /><span style={{ color: '#39FF14' }}>REAL RESULTS.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: '#161616', border: '1px solid #222', padding: '1.2rem 1.8rem' }}>
              <div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '2.4rem', color: '#39FF14', lineHeight: 1 }}>5.0</div>
                <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#39FF14" style={{ color: '#39FF14' }} />)}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #2a2a2a', paddingLeft: '1.2rem' }}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>311</div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase' }}>GOOGLE REVIEWS</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: '#1a1a1a' }}>
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="rev-card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#39FF14" style={{ color: '#39FF14' }} />)}
                  </div>
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.14em', color: '#444' }}>{r.time}</span>
                </div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '3rem', color: '#39FF14', lineHeight: 1, marginBottom: '-0.4rem' }}>"</div>
                <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.8, color: '#777', marginBottom: '1.8rem' }}>{r.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderTop: '1px solid #1e1e1e', paddingTop: '1.2rem', marginTop: 'auto' }}>
                  <div style={{ width: '38px', height: '38px', background: '#39FF14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1rem', color: '#111', flexShrink: 0 }}>
                    {r.initial}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#E5E2E3' }}>{r.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#444' }}>Verified Member</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Pros strip */}
        <Reveal delay={100}>
          <div style={{ marginTop: '1px', background: '#161616', border: '1px solid #1e1e1e', borderTop: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0' }}>
            {[
              { label: 'EQUIPMENT QUALITY', val: 98 },
              { label: 'CLEANLINESS', val: 96 },
              { label: 'COACHING', val: 99 },
            ].map((p, i) => (
              <div key={i} style={{ padding: '1.5rem 2rem', borderLeft: i > 0 ? '1px solid #222' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#666', textTransform: 'uppercase' }}>{p.label}</span>
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.72rem', color: '#39FF14' }}>{p.val}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${p.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════ */
function Contact() {
  const [interest, setInterest] = useState('');

  return (
    <section id="contact" style={{ background: '#111', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>GET IN TOUCH</div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, textTransform: 'uppercase', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.02em', color: '#fff' }}>
              READY TO<br /><span style={{ color: '#39FF14' }}>TRANSFORM?</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: '#1a1a1a' }}>
          {/* Info panel */}
          <Reveal>
            <div style={{ background: '#0e0e0e', padding: '3rem', height: '100%' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', marginBottom: '4px' }}>SARK GYM</div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#39FF14', textTransform: 'uppercase' }}>DHANBAD, JHARKHAND</div>
              </div>

              <div style={{ height: '1px', background: '#1e1e1e', marginBottom: '2rem' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', marginBottom: '2.5rem' }}>
                {[
                  { icon: <MapPin size={15} />, label: 'ADDRESS', val: 'First Floor, Vinod Bihari Chowk, Samrat Mega Mart, Bypass, Bhuli, Dhanbad, Jharkhand 826012' },
                  { icon: <Phone size={15} />,  label: 'PHONE',   val: '+91 95602 06136' },
                  { icon: <Clock size={15} />,  label: 'HOURS',   val: 'Monday – Sunday\n06:00 AM – 10:00 AM' },
                  { icon: <Mail size={15} />,   label: 'NEAREST', val: 'Bhuli Railway Station (~1.2 km)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', background: 'rgba(57,255,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#39FF14', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.58rem', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.6, color: '#888', whiteSpace: 'pre-line' }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: '#1e1e1e', marginBottom: '2rem' }} />

              <div style={{ overflow: 'hidden', height: '160px', border: '1px solid #1e1e1e' }}>
                <iframe
                  title="SARK GYM Map"
                  src="https://maps.google.com/maps?q=Sark+Gym,+Vinod+Bihari+Chowk,+Bhuli,+Dhanbad,+Jharkhand+826012&output=embed"
                  width="100%" height="160"
                  style={{ border: 0, filter: 'invert(0.9) hue-rotate(165deg) contrast(0.85)' }}
                  allowFullScreen loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={100}>
            <form
              style={{ background: '#161616', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}
              onSubmit={e => e.preventDefault()}
            >
              <div>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', marginBottom: '4px' }}>SEND A MESSAGE</div>
                <div style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.82rem', color: '#555' }}>We'll respond within 24 hours.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input type="text" placeholder="FULL NAME" className="brutal-input" />
                <input type="email" placeholder="EMAIL" className="brutal-input" />
              </div>
              <input type="tel" placeholder="PHONE NUMBER" className="brutal-input" />

              <select
                className="brutal-input"
                value={interest}
                onChange={e => setInterest(e.target.value)}
                style={{ cursor: 'pointer', color: interest ? '#fff' : '#555' }}
              >
                <option value="" disabled>I'M INTERESTED IN…</option>
                <option value="personal">PERSONAL TRAINING</option>
                <option value="strength">STRENGTH TRAINING</option>
                <option value="group">GROUP SESSIONS</option>
                <option value="general">GENERAL MEMBERSHIP</option>
              </select>

              <textarea
                placeholder="YOUR FITNESS GOALS…"
                rows={4}
                className="brutal-input"
                style={{ resize: 'none' }}
              />

              <button type="submit" className="btn-lime" style={{ justifyContent: 'center', width: '100%', padding: '1.1rem' }}>
                SEND MESSAGE <ArrowRight size={16} />
              </button>

              <p style={{ fontFamily: 'Inter', fontSize: '0.72rem', color: '#444', textAlign: 'center' }}>
                Or call: <a href="tel:+919560206136" style={{ color: '#39FF14', fontWeight: 600, textDecoration: 'none' }}>+91 95602 06136</a>
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer() {
  const navLinks = ['Home', 'About', 'Services', 'Schedule', 'Reviews', 'Contact'];
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #1a1a1a', marginBottom: '2rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#39FF14', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))' }}>
                <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.7rem', color: '#111' }}>SG</span>
              </div>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase' }}>SARK<span style={{ color: '#39FF14' }}>GYM</span></span>
            </div>
            <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.8, color: '#444', maxWidth: '280px' }}>
              Dhanbad's most intense training ground. Professional coaching, premium equipment, zero excuses.
            </p>
          </div>
          {/* Nav */}
          <div>
            <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.6rem', letterSpacing: '0.22em', color: '#39FF14', textTransform: 'uppercase', marginBottom: '1.2rem' }}>NAVIGATE</div>
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ display: 'block', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#444', textDecoration: 'none', marginBottom: '0.75rem', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#39FF14')}
                onMouseLeave={e => (e.currentTarget.style.color = '#444')}
              >{l}</a>
            ))}
          </div>
          {/* Contact */}
          <div>
            <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '0.6rem', letterSpacing: '0.22em', color: '#39FF14', textTransform: 'uppercase', marginBottom: '1.2rem' }}>CONTACT</div>
            {[
              { icon: <Phone size={12} />, val: '+91 95602 06136', href: 'tel:+919560206136' },
              { icon: <Clock size={12} />,  val: 'Mon–Sun · 06:00–10:00 AM', href: undefined },
              { icon: <MapPin size={12} />, val: 'Bhuli, Dhanbad 826012', href: undefined },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.8rem' }}>
                <span style={{ color: '#39FF14', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                {item.href
                  ? <a href={item.href} style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.78rem', color: '#444', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#444')}
                    >{item.val}</a>
                  : <span style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.78rem', color: '#444' }}>{item.val}</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.72rem', color: '#333' }}>
            © {new Date().getFullYear()} SARK GYM · ALL RIGHTS RESERVED · DHANBAD, JHARKHAND
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#39FF14" style={{ color: '#39FF14' }} />)}
            <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.12em', color: '#333', marginLeft: '6px' }}>5.0 · 311 GOOGLE REVIEWS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT
═══════════════════════════════════════════ */
export default function App() {
  return (
    <div style={{ background: '#111' }}>
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <StatsBand />
      <Services />
      <FullBleedCTA />
      <Facility />
      <Schedule />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}
