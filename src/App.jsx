import { useEffect, useState } from 'react'
import './App.css'

const WEDDING_DATE = new Date('2027-07-09T09:00:00+05:30').getTime()
const GUESTBOOK_KEY = 'ashwin-amritha-guestbook-v1'
const mapUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Lalith+Mahal+Kalyana+Mandapam,+Anakottil+Street,+West+Fort,+Thiruvananthapuram,+Kerala+695023'
<a
  className="map-link"
  href={mapUrl}
  target="_blank"
  rel="noreferrer"
>s
  GET VENUE DIRECTIONS ↗
</a>
  const SECRET_MESSAGES = [
  'Your presence is the most beautiful gift you could bring. Thank you for being part of our celebration!',
  'Today is about love, laughter, and the people who make life special. We are so glad you are here.',
  'May this celebration leave you with lovely memories and a heart full of happiness.',
  'Every beautiful celebration becomes unforgettable because of the people who share it. Thank you for joining us!',
  'You are part of the story we are celebrating today. We hope you enjoy every moment of this special occasion.',
  'May the music be joyful, the conversations warm, and the memories from today last for years to come.',
  'Remember to smile, celebrate, enjoy the food, and make wonderful memories!',
  'The best celebrations are made brighter by the people who fill them with happiness. Welcome!',
  'Thank you for taking the time to celebrate with us. Your presence makes this occasion even more meaningful.',
  'Here is to happy hearts, beautiful memories, and a celebration made brighter by having you here. Enjoy the day!',
]

const TREASURES = [
  { id: 'star', symbol: '✦', hint: 'Look around the welcome section.' },
  { id: 'leaf', symbol: '❦', hint: 'Explore the story section.' },
  { id: 'sparkle', symbol: '✧', hint: 'Take a look near the event details.' },
]

function getTimeLeft() {
  const difference = Math.max(0, WEDDING_DATE - Date.now())

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function readGuestbook() {
  try {
    const saved = localStorage.getItem(GUESTBOOK_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function CouplePortrait({ className = '' }) {
  return (
    <img
      className={`couple-portrait ${className}`}
      src={`${import.meta.env.BASE_URL}couple-cartoon.png`}
      alt="Ashwin and Amritha in their wedding attire"
    />
  )
}

function OrnamentDivider() {
  return (
    <div className="ornament-divider" aria-hidden="true">
      <span />
      <b>✥</b>
      <span />
    </div>
  )
}

function TreasureSymbol({ treasure, found, onFind }) {
  return (
    <button
      className={`hidden-treasure ${found ? 'treasure-found' : ''}`}
      onClick={onFind}
      type="button"
      aria-label={found ? 'Treasure found' : 'Find hidden treasure'}
      title={found ? 'Found!' : 'A hidden treasure'}
    >
      {found ? treasure.symbol : '✧'}
    </button>
  )
}

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  const [invitationOpened, setInvitationOpened] = useState(false)
  const [secretRevealed, setSecretRevealed] = useState(false)

  const [secretMessageIndex, setSecretMessageIndex] = useState(
    () => Math.floor(Math.random() * SECRET_MESSAGES.length),
  )

  const [scratchRevealed, setScratchRevealed] = useState(false)
  const [foundTreasures, setFoundTreasures] = useState([])

  const [guestName, setGuestName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [guestbook, setGuestbook] = useState(readGuestbook)
  const [guestbookNotice, setGuestbookNotice] = useState('')
  const [showAllWishes, setShowAllWishes] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(
      () => setTimeLeft(getTimeLeft()),
      1000,
    )

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(
        GUESTBOOK_KEY,
        JSON.stringify(guestbook),
      )
    } catch {
      setGuestbookNotice(
        'Your browser could not save this message.',
      )
    }
  }, [guestbook])

  function revealAnotherMessage() {
    setSecretMessageIndex((previous) => {
      if (SECRET_MESSAGES.length < 2) return previous

      let next = previous

      while (next === previous) {
        next = Math.floor(
          Math.random() * SECRET_MESSAGES.length,
        )
      }

      return next
    })

    setSecretRevealed(true)
  }

  function findTreasure(id) {
    setFoundTreasures((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    )
  }

  function addWish(event) {
    event.preventDefault()

    const name = guestName.trim()
    const message = guestMessage.trim()

    if (!name || !message) {
      setGuestbookNotice('Please enter your name and a message.')
      return
    }

    if (name.length > 60 || message.length > 400) {
      setGuestbookNotice('Please shorten your name or message.')
      return
    }

    const wish = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      message,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }

    setGuestbook((previous) => [wish, ...previous].slice(0, 100))
    setGuestName('')
    setGuestMessage('')
    setGuestbookNotice(
      'Your wish has been saved on this device. Thank you!',
    )
  }

  const countdown = [
    { value: timeLeft.days, label: 'Days' },
    {
      value: String(timeLeft.hours).padStart(2, '0'),
      label: 'Hours',
    },
    {
      value: String(timeLeft.minutes).padStart(2, '0'),
      label: 'Minutes',
    },
    {
      value: String(timeLeft.seconds).padStart(2, '0'),
      label: 'Seconds',
    },
  ]

  const mapUrl =
    'https://www.google.com/maps/search/?api=1&query=Lalitha+Mahal+Thiruvananthapuram+Kerala'

  const wishesToShow = showAllWishes
    ? guestbook
    : guestbook.slice(0, 3)

  return (
    <main className="wedding-page" id="home">
      {!invitationOpened && (
        <div className="invitation-screen">
          <div className="invitation-stars" aria-hidden="true">
            ✦　·　✧　·　✦
          </div>

          <p className="eyebrow">A SPECIAL INVITATION FOR YOU</p>

          <button
            className="envelope-button"
            onClick={() => setInvitationOpened(true)}
            aria-label="Open the wedding invitation"
            type="button"
          >
            <span className="envelope-back">
              <span className="envelope-letter">
                <span className="letter-flourish">✥</span>
                <span>You&apos;re invited</span>
              </span>

              <span className="envelope-flap" />
              <span className="envelope-front" />

              <span className="envelope-seal">
                <img src={`${import.meta.env.BASE_URL}wedding-logo.png`} alt="" />
              </span>
            </span>

            <span className="envelope-action">
              OPEN YOUR INVITATION ↗
            </span>
          </button>

          <p className="invitation-date">08 · 09 JULY 2027</p>
        </div>
      )}

      <header className="navbar">
        <a className="brand" href="#home" aria-label="Home">
          <img src="/wedding-logo.png" alt="Wedding monogram" />
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#story">Our Story</a>
          <a href="#events">Events</a>
          <a href="#scratch">Surprise</a>
          <a href="#treasure-hunt">Treasure Hunt</a>
          <a href="#guestbook">Guestbook</a>
        </nav>
      </header>

      <section className="hero" id="welcome">
        <div className="hero-copy">
          <p className="eyebrow">TOGETHER WITH OUR FAMILIES</p>

          <h1>
            A celebration of <em>love</em>
          </h1>

          <OrnamentDivider />

          <p className="hero-names">
            Ashwin Sharma H <span>&amp;</span> Amritha Devi N
          </p>

          <p className="hero-description">
            We would be delighted to have you with us as we begin
            a beautiful new chapter.
          </p>

          <a className="gold-action" href="#events">
            EXPLORE THE CELEBRATION ↓
          </a>
        </div>

        <div className="hero-art">
          <div className="hero-frame">
            <CouplePortrait />
          </div>

          <span className="hero-corner hero-corner-one">✦</span>
          <span className="hero-corner hero-corner-two">✧</span>

          <div className="treasure-anchor treasure-hero">
            <TreasureSymbol
              treasure={TREASURES[0]}
              found={foundTreasures.includes(TREASURES[0].id)}
              onFind={() => findTreasure(TREASURES[0].id)}
            />
          </div>
        </div>
      </section>

      <section className="countdown-section" id="countdown">
        <p className="eyebrow">THE COUNTDOWN BEGINS</p>
        <h2>Until we say “I do”</h2>

        <div className="countdown-grid">
          {countdown.map((item) => (
            <div className="countdown-item" key={item.label}>
              <span>{item.value}</span>
              <small>{item.label}</small>
            </div>
          ))}
        </div>

        <p className="countdown-date">
          09 JULY 2027 · 9:00 AM
        </p>
      </section>

      <section className="story-section" id="story">
        <div className="story-art">
          <CouplePortrait />

          <div className="treasure-anchor treasure-story">
            <TreasureSymbol
              treasure={TREASURES[1]}
              found={foundTreasures.includes(TREASURES[1].id)}
              onFind={() => findTreasure(TREASURES[1].id)}
            />
          </div>
        </div>

        <div className="story-copy">
          <p className="eyebrow">A NEW CHAPTER</p>
          <h2>Our Story, Your Place in It</h2>
          <OrnamentDivider />

          <p>
            Some moments become even more special when shared
            with the people who matter. We are looking forward
            to gathering our favourite people for a celebration
            filled with warmth, laughter, and memories.
          </p>

          <p>
            Thank you for being part of this journey. We cannot
            wait to celebrate with you.
          </p>
        </div>
      </section>

      <section className="surprise-section" id="surprise">
        <div className="surprise-inner">
          <p className="eyebrow">A LITTLE SOMETHING FOR YOU</p>
          <h2>A Note from the Heart</h2>

          <p className="surprise-intro">
            Every guest is part of what makes this celebration
            special. There&apos;s a little message waiting just for you.
          </p>

          {!secretRevealed ? (
            <button
              className="secret-seal"
              onClick={() => setSecretRevealed(true)}
              aria-label="Open your special message"
              type="button"
            >
              <span className="seal-sparkle">✦</span>
              <span className="seal-monogram">✥</span>
              <span className="seal-caption">OPEN YOUR NOTE</span>
            </button>
          ) : (
            <div className="secret-letter" key={secretMessageIndex}>
              <span className="letter-flower">❧</span>
              <p className="letter-label">A LITTLE NOTE FOR OUR GUEST</p>

              <p className="secret-quote">
                “{SECRET_MESSAGES[secretMessageIndex]}”
              </p>

              <div className="letter-divider">✦ ✦ ✦</div>

              <button
                className="another-message-button"
                onClick={revealAnotherMessage}
                type="button"
              >
                Reveal Another Message ↗
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="engagement-section" id="scratch">
        <p className="eyebrow">A LITTLE GIFT FOR YOU</p>
        <h2>Unwrap a Surprise</h2>

        <p className="engagement-intro">
          Tap the golden card to reveal a little reminder to
          enjoy every moment.
        </p>

        <button
          className={`scratch-card ${scratchRevealed ? 'is-revealed' : ''}`}
          onClick={() => setScratchRevealed(true)}
          aria-label="Reveal your surprise"
          type="button"
        >
          {scratchRevealed ? (
            <span className="scratch-message">
              <span className="scratch-star">✦</span>

              <strong>Your surprise is a beautiful memory!</strong>

              <span>
                Celebrate, take photos, enjoy the food, and leave
                with happy memories.
              </span>

              <small>WITH LOVE AND GRATITUDE</small>
            </span>
          ) : (
            <span className="scratch-cover">
              <span className="scratch-star">✧</span>
              <strong>A SURPRISE AWAITS</strong>
              <span>✦ TAP TO REVEAL ✦</span>
            </span>
          )}
        </button>
      </section>

      <section
        className="engagement-section treasure-section"
        id="treasure-hunt"
      >
        <p className="eyebrow">A LITTLE ADVENTURE</p>
        <h2>The Golden Treasure Hunt</h2>

        <p className="engagement-intro">
          Three tiny symbols are hidden around this invitation.
          Can you find them all?
        </p>

        <div className="treasure-progress">
          {TREASURES.map((treasure) => (
            <span
              key={treasure.id}
              className={
                foundTreasures.includes(treasure.id)
                  ? 'treasure-collected'
                  : ''
              }
            >
              {foundTreasures.includes(treasure.id)
                ? treasure.symbol
                : '?'}
            </span>
          ))}
        </div>

        <p className="treasure-count">
          {foundTreasures.length} of {TREASURES.length} treasures found
        </p>

        {foundTreasures.length < TREASURES.length && (
          <p className="treasure-hint">
            Hint:{' '}
            {
              TREASURES.find(
                (treasure) =>
                  !foundTreasures.includes(treasure.id),
              )?.hint
            }
          </p>
        )}

        {foundTreasures.length === TREASURES.length && (
          <div className="treasure-unlocked">
            <span>✦</span>
            <h3>You found every treasure!</h3>
            <p>
              Your reward: a little extra love and a big thank-you
              for exploring our invitation. We hope to see you at
              the celebration!
            </p>
          </div>
        )}
      </section>

      <section className="events-section" id="events">
        <p className="eyebrow">SAVE THE DATES</p>
        <h2>Join Us for the Celebration</h2>
        <OrnamentDivider />

        <div className="events-grid">
          <article className="event-card">
            <span className="event-icon">✧</span>
            <p className="event-label">ENGAGEMENT &amp; RECEPTION</p>
            <h3>Evening Celebration</h3>
            <p className="event-date">Thursday · 08 July 2027</p>
            <p>4:00 PM – 9:00 PM</p>
            <span className="event-line" />
            <p className="event-venue">Lalitha Mahal</p>

            <a
              className="map-link"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              GET DIRECTIONS ↗
            </a>
          </article>

          <article className="event-card">
            <span className="event-icon">✦</span>
            <p className="event-label">WEDDING CEREMONY</p>
            <h3>The Wedding</h3>
            <p className="event-date">Friday · 09 July 2027</p>
            <p>9:00 AM – 10:00 AM</p>
            <span className="event-line" />
            <p className="event-venue">Lalitha Mahal</p>

            <a
              className="map-link"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              GET DIRECTIONS ↗
            </a>
          </article>
        </div>

        <p className="venue-note">Thiruvananthapuram, Kerala</p>

        <div className="treasure-anchor treasure-events">
          <TreasureSymbol
            treasure={TREASURES[2]}
            found={foundTreasures.includes(TREASURES[2].id)}
            onFind={() => findTreasure(TREASURES[2].id)}
          />
        </div>
      </section>

      <section className="guestbook-section" id="guestbook">
        <p className="eyebrow">LEAVE A LITTLE LOVE</p>
        <h2>Guestbook</h2>

        <p className="guestbook-intro">
          Leave a wish, a blessing, or a little note for the
          celebration.
        </p>

        <form className="guestbook-form" onSubmit={addWish}>
          <label htmlFor="guest-name">Your name</label>
          <input
            id="guest-name"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            maxLength={60}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="guest-message">Your message</label>
          <textarea
            id="guest-message"
            value={guestMessage}
            onChange={(event) => setGuestMessage(event.target.value)}
            maxLength={400}
            rows={4}
            placeholder="Write your wishes here..."
            required
          />

          <button className="gold-action" type="submit">
            LEAVE YOUR WISH ↗
          </button>

          {guestbookNotice && (
            <p className="guestbook-notice" role="status">
              {guestbookNotice}
            </p>
          )}
        </form>

        {guestbook.length > 0 && (
          <div className="wishes-area">
            <h3>Kind Words from Guests</h3>

            <div className="wishes-grid">
              {wishesToShow.map((wish) => (
                <article className="wish-card" key={wish.id}>
                  <span className="wish-mark">“</span>
                  <p>{wish.message}</p>
                  <strong>{wish.name}</strong>
                  <small>{wish.date}</small>
                </article>
              ))}
            </div>

            {guestbook.length > 3 && (
              <button
                className="another-message-button"
                onClick={() => setShowAllWishes((value) => !value)}
                type="button"
              >
                {showAllWishes ? 'SHOW LESS' : 'READ ALL WISHES'}
              </button>
            )}
          </div>
        )}

        <p className="guestbook-local-note">
          Wishes are saved in this browser only. A shared guestbook
          requires a database.
        </p>
      </section>

      <footer className="footer">
        <img src="/wedding-logo.png" alt="Wedding monogram" />
        <p>With love,</p>
        <h2>
          Ashwin <span>&amp;</span> Amritha
        </h2>
        <p>08 · 09 JULY 2027 · THIRUVANANTHAPURAM</p>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </main>
  )
}

export default App