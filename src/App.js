import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Floating hearts
const hearts = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${(index * 29 + 8) % 100}%`,
  delay: (index % 6) * 0.8,
  duration: 8 + (index % 5) * 2,
}));

// Floating flowers
const flowers = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 3) % 100}%`,
  delay: (index % 8) * 0.9,
  duration: 9 + (index % 5) * 3,
  size: 14 + (index % 5) * 7,
  symbol: ['✿', '❀', '✾', '❋', '❁'][index % 5],
}));

// Extra flowers + hearts layered ON the pink cover card
const coverDecor = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 23 + 6) % 100}%`,
  top: `${(index * 37 + 11) % 100}%`,
  size: 22 + (index % 4) * 10,
  delay: (index % 5) * 0.6,
  symbol:
    index % 2 === 0
      ? ['✿', '❀', '✾', '❋'][index % 4]
      : ['♥', '♡'][index % 2],
  isHeart: index % 2 !== 0,
}));

export default function App() {
  const [page, setPage] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // Start music when the user opens the invitation
  const handleOpen = () => {
    setPage(1);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.4; // soft background level
      audio.play().catch(() => {
        /* browser blocked it — user can toggle manually */
      });
    }
  };

  // Toggle sound on/off
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setMuted(false);
    } else {
      audio.pause();
      setMuted(true);
    }
  };

  return (
    <main className="welcome-page">
      {/* Background music */}
      <audio
        ref={audioRef}
        src={`${process.env.PUBLIC_URL}/music/anniversary.mp3`}
        loop
        preload="auto"
      />

      {/* Floating sound toggle */}
      <button
        className="sound-toggle"
        onClick={toggleMute}
        aria-label={muted ? 'Play music' : 'Pause music'}
        type="button"
      >
        {muted ? '♪̸' : '♪'}
      </button>

      <div className="glow glow-one" />
      <div className="glow glow-two" />

      {/* Floating hearts */}
      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className="floating-heart"
            style={{ left: heart.left }}
            initial={{ y: '105vh', opacity: 0 }}
            animate={{
              y: '-15vh',
              opacity: [0, 0.7, 0.7, 0],
              x: [0, 12, -10, 5, 0],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {heart.id % 3 === 0 ? '♥' : '♡'}
          </motion.span>
        ))}
      </div>

      {/* Floating flowers */}
      <div className="floating-flowers" aria-hidden="true">
        {flowers.map((flower) => (
          <motion.span
            key={flower.id}
            className="floating-flower"
            style={{ left: flower.left, fontSize: `${flower.size}px` }}
            initial={{ y: '110vh', opacity: 0, rotate: 0 }}
            animate={{
              y: '-15vh',
              opacity: [0, 0.75, 0.75, 0],
              rotate: 360,
              x: [0, 30, -25, 15, 0],
            }}
            transition={{
              duration: flower.duration,
              delay: flower.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {flower.symbol}
          </motion.span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ---------- PAGE 1: PINK COVER ---------- */}
        {page === 0 && (
          <motion.section
            key="cover"
            className="invitation-card cover-card"
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.65 }}
          >
            <div className="cover-decor" aria-hidden="true">
              {coverDecor.map((item) => (
                <motion.span
                  key={item.id}
                  className={
                    item.isHeart
                      ? 'cover-decor-item cover-decor-heart'
                      : 'cover-decor-item cover-decor-flower'
                  }
                  style={{
                    left: item.left,
                    top: item.top,
                    fontSize: `${item.size}px`,
                  }}
                  animate={{
                    y: [0, -8, 0, 8, 0],
                    rotate: [0, 8, -8, 0],
                    opacity: [0.55, 0.95, 0.55],
                  }}
                  transition={{
                    duration: 5 + (item.id % 4),
                    delay: item.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {item.symbol}
                </motion.span>
              ))}
            </div>

            <div className="cover-content">
              <div className="top-decoration">✧ ♡ ✧</div>

              <p className="small-heading">A SPECIAL CELEBRATION</p>

              <h1>
                Mr &amp; Mrs
                <br />
                <em>Mpeke</em>
              </h1>

              <div className="gold-divider">
                <span />♡<span />
              </div>

              <p className="cover-question">
                Do you want to see
                <br />
                <em>what's inside?</em>
              </p>

              <motion.button
                className="open-button"
                onClick={handleOpen}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>♡</span> Tap to Open <span>♡</span>
              </motion.button>

              <p className="cover-date">18 December</p>

              <div className="bottom-decoration">✧ ♡ ✧</div>
            </div>
          </motion.section>
        )}

        {/* ---------- PAGE 2: WELCOME + PHOTO ---------- */}
        {page === 1 && (
          <motion.section
            key="welcome"
            className="invitation-card opened-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="opened-heart"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.8 }}
            >
              ♡
            </motion.div>

            <p className="small-heading">A MESSAGE FROM YOUR FAMILY</p>

            <div className="photo-frame">
              <img
                src={`${process.env.PUBLIC_URL}/photos/parents-1.jpeg`}
                alt="Mr and Mrs Mpeke"
                className="couple-photo"
              />
            </div>

            <h1>
              This is for
              <br />
              <em>you, Mom &amp; Dad</em>
            </h1>

            <p className="welcome-message">
              Sixteen years of memories, faith, commitment, and a
              family filled with love. Today, we celebrate the
              beautiful story you continue to write together.
            </p>

            <p className="couple-name">Happy 16th Anniversary!</p>

            <div className="gold-divider">
              <span />♡<span />
            </div>

            <p className="welcome-message">
              Thank you for the love, guidance, and beautiful
              example you give our family. May Jehovah continue
              to bless your marriage and the home you have built
              together.
            </p>

            <motion.button
              className="open-button"
              onClick={() => setPage(2)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>♡</span> Read our letter <span>♡</span>
            </motion.button>

            <p className="date-note">With all our love, always ♡</p>

            <button className="text-button" onClick={() => setPage(0)}>
              ← Back to the invitation
            </button>
          </motion.section>
        )}

        {/* ---------- PAGE 3: LETTER + PHOTO ---------- */}
        {page === 2 && (
          <motion.section
            key="letter"
            className="invitation-card letter-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
          >
            <div className="top-decoration">✧ ♡ ✧</div>

            <p className="small-heading">A LETTER FROM YOUR CHILDREN</p>

            <div className="photo-frame">
              <img
                src={`${process.env.PUBLIC_URL}/photos/parents-2.jpeg`}
                alt="Mr and Mrs Mpeke together"
                className="couple-photo"
              />
            </div>

            <h1>
              Dear
              <br />
              <em>Mom &amp; Dad</em>
            </h1>

            <div className="gold-divider">
              <span />♡<span />
            </div>

            <p className="letter-text">
              Sixteen years ago, you said “I do” — and from that
              promise grew a home, a family, and a love that has
              carried us through every season.
            </p>

            <p className="letter-text">
              Thank you for the sacrifices we never saw, the
              prayers we never heard, and the love we always felt.
              You have taught us what patience looks like, what
              forgiveness sounds like, and what faith in Jehovah
              truly means.
            </p>

            <p className="letter-text">
              We are who we are because of you. And today we want
              you to know: we see you, we honour you, and we are
              endlessly grateful for you.
            </p>

            <blockquote className="verse">
              “Love is patient and kind… it bears all things,
              believes all things, hopes all things, endures all
              things. Love never fails.”
              <cite>— 1 Corinthians 13:4, 7, 8</cite>
            </blockquote>

            <p className="letter-text">
              May Jehovah continue to bless your marriage, keep
              you in good health, and fill your years together
              with peace and joy.
            </p>

            <p className="couple-name">Happy 16th Anniversary ♡</p>

            <p className="signature">
              With all our love,
              <br />
              <span>Bonny · Hlally · Tsepza · Pablo · Kay</span>
            </p>

            <div className="gold-divider">
              <span />♡<span />
            </div>

            <button className="text-button" onClick={() => setPage(1)}>
              ← Back to the message
            </button>

            <p className="date-note">18 December · Forever grateful</p>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="page-footer">
        CREATED WITH LOVE FOR MR &amp; MRS MPEKE
      </footer>
    </main>
  );
}