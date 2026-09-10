import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL_THOUGHTS = [
  { text: "Don't ask what the world needs. Ask what makes you come alive, and go do it. Because what the world needs is people who have come alive." },
  { text: "If all external metrics disappeared tomorrow — no salary, no recognition, no one watching — would you still do this? With the same intensity?" },
  { text: "Use a north star as a heuristic. Will doing this make me more free?", source: "Naval" },
  { text: "Will doing this help the customer?", source: "Jeff Bezos" },
  { text: "Am I on the exponential? If not, what can I do to get on it?" },
  { text: "I often get the question from entrepreneurs or executives, \"What should I do next?\" My answer has always been \"become deeply self aware and when the right thing comes, you will know it. If you know yourself, your next thing, your new idea, your work soulmate will reveal itself.\" When I told my friends, family and colleagues about my plans for what was next, they were really excited that I was \"coming back.\" The thing is, I never left.", source: "Travis Kalanick" },
  { text: "It is challenging to really reason as if you believe in continued capability progress, even when you do. It is challenging to reason about the pace of change. These winning companies may not be the first ones." },
  { text: "Do not be deceived: God is not mocked, for whatever one sows, that will he also reap. For the one who sows to his own flesh will from the flesh reap corruption, but the one who sows to the Spirit will from the Spirit reap eternal life.", source: "Galatians 6:7-8" },
  { text: "If we deliberately keep on sinning after we have received the knowledge of the truth, no sacrifice for sins is left, but only a fearful expectation of judgment and of raging fire that will consume the enemies of God. Anyone who rejected the law of Moses died without mercy on the testimony of two or three witnesses. How much more severely do you think someone deserves to be punished who has trampled the Son of God underfoot, who has treated as an unholy thing the blood of the covenant that sanctified them, and who has insulted the Spirit of grace? For we know him who said, \"It is mine to avenge; I will repay,\" and again, \"The Lord will judge his people.\" It is a dreadful thing to fall into the hands of the living God.", source: "Hebrews 10:26-31" },
  { text: "There are many places that a company can choose to allocate its limited time and resources. There is never enough time to do everything, so companies need to choose what change they want to see in the world and focus there. It can take decades to move the needle on large global challenges.", source: "Coinbase" },
  { text: "The deeper insight is about selection, not education. The research found that 62% of unicorn founders held post-graduate degrees, and founders with at least three years of prior work experience in their startup's specific industry were 85% more likely to launch a highly successful venture. Even VCs who are enthusiastic about dropouts note that founders still get \"a lot of the social value\" from elite universities even without a diploma — because what really matters is the network and brand signal, not the degree itself." },
  { text: "Thiel's actual argument isn't really \"ignore Kelly and bet everything on moonshots.\" It's closer to: develop such deep understanding of something that you genuinely have edge, then bet accordingly. That's actually consistent with everything in the essay. The problem is most people hear \"Thiel made a 1000x return on Facebook\" and conclude \"concentrated moonshots work\" without doing the harder work of actually developing genuine edge first. The question to ask yourself isn't \"should I do moonshots like Thiel?\" but \"do I actually have the edge that would make a concentrated bet Kelly-rational?\"" },
  { text: "A person acts with their own body, while an institution acts through distributed layers of authorized execution, role structure, process, and enforcement. This difference explains why scale has always depended on delegation rather than on intelligence or will in isolation. No city, state, empire, firm, or administrative order ever scaled through direct presence alone. Scale begins when intent no longer needs to remain physically attached to the person who initiated it, and when action can continue elsewhere under recognizable authority. Delegation extends reach, increases continuity, and enlarges the effective surface through which power can be exercised across distance, time, and complexity." },
  { text: "In short, imitation is good and you have to do it initially. But once you're bootstrapped enough, if you want to beat the teacher you must do on-policy RL and play to your own strengths and weaknesses. The lesson of doing RL on policy is that beating the teacher requires walking your own path and taking risks and rewards from the environment." },
  { text: "The disciplined life looks impressive, but the well-designed life lasts longer. Before you try to find more willpower, design your environment and arrange your day so you're more likely to follow through." },
  { text: "No one tells you running is 10 percent cardio and 90 percent negotiating with the voice begging you to quit.", source: "David Dack" },
  { text: "If you only wished to be happy, this could be easily accomplished; but we wish to be happier than other people, and this is always difficult, for we believe others to be happier than they are.", source: "Montesquieu" },
]

const ALL_PROBLEMS = [
  { title: "Loneliness in America", text: "We are seeing more people with fewer deep relationships, fewer families being formed, and more depression, sadness, and isolation than our culture should ever accept as normal." },
  { title: "High-speed rail in America", text: "A trip from Boston to New York should take less than an hour. A trip from San Francisco to Los Angeles should take less than two." },
  { title: "Decreasing inequality", text: "It is deeply disturbing when extreme wealth compounds while many Americans cannot afford rent, and the global gap is even larger: one dollar in Kenya can mean something radically different than one dollar in America." },
  { title: "Recursive coding capability", text: "The ability for software to help build better software is one of the most important leverage points in the next decade, and it should be made safe, legible, and broadly useful." },
  { title: "Polarization in America", text: "We need to revitalize the American experiment, restore democratic trust, and resist the drift toward authoritarianism." },
  { title: "Cultural degeneracy", text: "Too much of U.S. culture rewards figures like Andrew Tate: reactive, short-tempered, short-willed men who confuse dominance for strength." },
  { title: "Friendship and family", text: "Many young adults spend far less time with friends and family after college. Technology and the way we live should bring people into deeper social well-being, not more isolation." },
  { title: "Redefining well-being", text: "Too many young people treat money as the center of life. A better frame aims at five kinds of wealth: social, time, financial, physical, and mental." },
]

const ALL_ARTS = [
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/sfBridge.avif', alt: 'Golden Gate Bridge', title: 'Golden Gate Bridge' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/sanBridge.avif', alt: 'Golden Gate viewpoint', title: 'Golden Gate Viewpoint' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/rainbowSF.avif', alt: 'Rainbow over San Francisco', title: 'Rainbow SF' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/nyc.avif', alt: 'NYC skyline', title: 'Manhattan' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/lowellTower.avif', alt: 'Lowell Tower', title: 'Lowell Tower' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/clockTower.avif', alt: 'Clock tower', title: 'Clock Tower' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/winthropGate.avif', alt: 'Winthrop Gate', title: 'Winthrop Gate' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/bahamas.avif', alt: 'Bahamas', title: 'Bahamas' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/bahamasBoat.avif', alt: 'Bahamas sunset', title: 'Bahamas Sunset' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/bahamasTwo.avif', alt: 'Bahamas paradise', title: 'Bahamas Paradise' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/chinatown.avif', alt: 'Montreal Chinatown', title: 'Montreal Chinatown' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/cemeteryTwo.avif', alt: 'Legacy in stone', title: 'Legacy in Stone' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/cemetery.avif', alt: 'Boston resting place', title: 'Boston Resting Place' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/harvardSunset.avif', alt: 'Harvard sunset', title: 'Harvard Sunset' },
  { src: 'https://dulqbfqncy2gjzfj.public.blob.vercel-storage.com/eliotQuote.avif', alt: 'T.S. Eliot quote', title: 'T.S. Eliot' },
]

const HARDCODED_WRITING = [
  { title: 'What I learned this summer', link: 'https://zachchen.substack.com/p/what-i-learned-this-summer', date: "Aug '26" },
  { title: 'Spiderman grew up with us', link: 'https://zachchen.substack.com/p/spiderman-grew-up-with-us', date: "Aug '26" },
  { title: 'the curse of ambition', link: 'https://zachchen.substack.com/p/the-curse-of-ambition', date: "Jun '26" },
  { title: 'what harvard feels like from each year', link: 'https://zachchen.substack.com/p/what-harvard-feels-like-from-each', date: "May '26" },
  { title: 'Reflection of sophomore year at Harvard', link: 'https://zachchen.substack.com/p/reflection-of-sophomore-year-at-harvard', date: "May '26" },
  { title: 'Diminished Personhood', link: 'https://zachchen.substack.com/p/diminished-personhood', date: "Apr '26" },
  { title: 'Time just seems to fly by', link: 'https://zachchen.substack.com/p/time-just-seems-to-fly-by', date: "Mar '26" },
  { title: 'On Birthdays', link: 'https://zachchen.substack.com/p/on-birthdays', date: "Feb '26" },
  { title: 'how to kill morality', link: 'https://zachchen.substack.com/p/how-to-kill-morality', date: "Jan '26" },
  { title: 'On Effective Altruism', link: 'https://zachchen.substack.com/p/on-effective-altruism', date: "Jan '26" },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    return window.__initialTheme || localStorage.getItem('darkMode') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('darkMode', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  return [theme, toggle]
}

function useSubstackPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/substack')
      .then(r => r.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { posts, loading }
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ theme, onToggle }) {
  const [navOpen, setNavOpen] = useState(false)

  const navItems = [
    { label: 'resume', route: '/resume' },
    { label: 'writing', route: '/writing' },
    { label: 'thoughts', route: '/thoughts' },
    { label: 'aesthetics', route: '/aesthetics' },
  ]

  return (
    <header className="site-header">
      <div className="wrapper">
        <Link className="site-title" to="/">
          <span className="title-symbol">± </span>[zach:notes]
        </Link>

        <nav className="site-nav">
          <input
            type="checkbox"
            id="nav-trigger"
            className="nav-trigger"
            checked={navOpen}
            onChange={() => setNavOpen(o => !o)}
          />
          <label htmlFor="nav-trigger">
            <span className="menu-icon">±</span>
          </label>

          <div className="trigger">
            <div className="nav-overlay-header">
              <Link className="site-title" to="/">
                <span className="title-symbol">± </span>[zach:notes]
              </Link>
              <label
                htmlFor="nav-trigger"
                className="nav-overlay-close"
                aria-label="Close menu"
                onClick={() => setNavOpen(false)}
              >
                <span>±</span>
              </label>
            </div>

            <div className="nav-top-row">
              {navItems.map(item => (
                <span className="nav-item" key={item.label}>
                  [
                  <Link
                    className="page-link"
                    to={item.route}
                    onClick={() => setNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                  ]
                </span>
              ))}

              <div className="theme-toggle-wrapper">
                <label className="theme-toggle" htmlFor="darkModeToggle">
                  <input
                    type="checkbox"
                    id="darkModeToggle"
                    checked={theme === 'dark'}
                    onChange={onToggle}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="nav-toc-container" id="nav-toc-container"></div>
          </div>
        </nav>
      </div>
    </header>
  )
}

// ─── Shared Components ───────────────────────────────────────────────────────

function CustomLink({ href, children }) {
  return (
    <a
      href={href}
      className="custom-link"
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

function ResumeCitation({ num, children }) {
  return (
    <span className="resume-citation" tabIndex={0}>
      {num}
      <span className="resume-citation-popover">{children}</span>
    </span>
  )
}

function ArtGrid({ arts, onSelect }) {
  return (
    <div className="art-items-single">
      {arts.map((art) => (
        <div
          key={art.src}
          className="art-item"
          data-title={art.title}
          onClick={() => onSelect(art)}
          style={{ cursor: 'pointer' }}
        >
          <img src={art.src} alt={art.alt} loading="lazy" />
        </div>
      ))}
    </div>
  )
}

function Lightbox({ art, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!art) return null

  return (
    <div className="lightbox active" onClick={onClose}>
      <span className="lightbox-close" onClick={onClose}>×</span>
      <img src={art.src} alt={art.alt} onClick={e => e.stopPropagation()} />
    </div>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-headshot">
          <img src="/art/home/image copy.png" alt="City skyline footer" className="headshot-light" />
          <img src="/art/home/image.png" alt="City skyline footer" className="headshot-dark" />
        </div>
        <div className="footer-bottom">
          <div className="footer-socials">
            <Link to="/" aria-label="Home">
              <img src="/zach/zach-intro.jpg" alt="Zach Chen" className="footer-profile-icon" />
            </Link>
            <a href="https://x.com/theZachChen" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://github.com/Zxch-Chen" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/zachary-chen31415/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://zachchen.substack.com" target="_blank" rel="noopener noreferrer" aria-label="Substack">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
            </a>
          </div>
          <Link to="/" className="footer-brand">
            <span className="footer-symbol">± </span>[zach:notes]
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Profile Section ─────────────────────────────────────────────────────────

function ProfileSection() {
  return (
    <>
      <div className="profile-row">
        <div className="homepage-profile" id="resume">
          <img src="/zach/zach-intro.jpg" alt="Zach Chen" loading="eager" />
        </div>
        <a href="/old" className="old-style-btn">
          view old style →
        </a>
      </div>

      <p className="intro">
        I'm Zach Chen. I'm a philosopher builder at{' '}
        <CustomLink href="https://www.harvard.edu/">Harvard</CustomLink>{' '}
        studying CS with a secondary in philosophy. Right now I'm building{' '}
        <CustomLink href="https://trycirca.org">Circa</CustomLink>, a friends-first social
        app; working on ML projects — interpretability, evals, and fine-tuning small models;
        and thinking and writing about the future and human flourishing. I'm also involved
        with early-stage investing: I scout for{' '}
        <CustomLink href="https://embedding.vc/">Embedding VC</CustomLink>, am a venture
        partner at V11, and work with founders at{' '}
        <CustomLink href="https://tnt.so">TNT</CustomLink>, the Harvard/MIT accelerator —
        mostly technical diligence on pre-seed and seed AI and deep-tech companies.
      </p>
      <p className="intro intro-contact">
        I'm based between Harvard and wherever the next good idea needs me. Get in touch
        with{' '}
        <CustomLink href="mailto:zach.chen101@gmail.com">me</CustomLink>, read my{' '}
        <CustomLink href="https://zachchen.substack.com">Substack</CustomLink>, or find me
        on <CustomLink href="https://x.com/theZachChen">X</CustomLink>.
      </p>
    </>
  )
}

// ─── Home Page Section Previews ──────────────────────────────────────────────

function ResumePreview() {
  return (
    <>
      <h2 className="post-list-heading">[resume]</h2>
      <p>Current work and projects I keep returning to.</p>

      <ul className="favourite-essays">
        <li>
          <span className="essay-date">Now,</span>{' '}
          <a href="https://trycirca.org">
            Circa — a more authentic space for close friends
          </a>
        </li>
        <li>
          <span className="essay-date">Now,</span>{' '}
          <span>ML projects — interpretability, evals, fine-tuning</span>
        </li>
        <li>
          <span className="essay-date">Now,</span>{' '}
          <a href="https://zachchen.substack.com/">
            Thinking about the future and human flourishing
          </a>
        </li>
        <li>
          <span className="essay-date">Investing,</span>{' '}
          <a href="https://embedding.vc/">Embedding VC</a>, V11, and{' '}
          <a href="https://tnt.so">TNT</a> — pre-seed/seed technical diligence
        </li>
        <li>
          <span className="essay-date">Prev,</span>{' '}
          <a href="https://sapentia.ai">Sapentia AI — Cofounder</a>
        </li>
        <li>
          <span className="essay-date">Prev,</span>{' '}
          <a href="https://github.com/Zxch-Chen/cua-privacy-layer">
            PLVA — 1st place, H Company Computer Use Agent Hackathon
          </a>
        </li>
      </ul>
      <p className="background-text">
        <Link to="/resume" className="view-all-link">view full resume →</Link>
      </p>
    </>
  )
}

function WritingPreview() {
  return (
    <>
      <h2 className="post-list-heading">[writing]</h2>
      <p className="civilisation-lead">
        Latest from{' '}
        <CustomLink href="https://zachchen.substack.com/">Towards the North Star</CustomLink>
        : thoughts, essays, and deep-dives ranging from the macro to the micro.
      </p>

      <ul className="favourite-essays">
        {HARDCODED_WRITING.slice(0, 4).map((post) => (
          <li key={post.link}>
            <span className="essay-date">{post.date},</span>{' '}
            <a href={post.link}>{post.title}</a>
          </li>
        ))}
      </ul>
      <p className="background-text">
        <Link to="/writing" className="view-all-link">view all writing →</Link>
      </p>
    </>
  )
}

function ThoughtsPreview() {
  return (
    <>
      <h2 className="post-list-heading">[thoughts]</h2>
      <p className="civilisation-lead">
        A small commonplace book of ideas, scripture, and fragments worth returning to.
      </p>
      <ul className="beliefs">
        {ALL_THOUGHTS.slice(0, 3).map((thought, i) => (
          <li key={i}>
            {thought.text}
            {thought.source && <> — {thought.source}</>}
          </li>
        ))}
      </ul>
      <p className="background-text">
        <Link to="/thoughts" className="view-all-link">view all thoughts →</Link>
      </p>
    </>
  )
}

function AestheticsPreview() {
  const [lightbox, setLightbox] = useState(null)
  const previewArts = ALL_ARTS.slice(0, 4)

  return (
    <>
      <h2 className="post-list-heading">[aesthetics worth remembering]</h2>
      <ArtGrid arts={previewArts} onSelect={setLightbox} />
      <p className="background-text" style={{ marginTop: '1rem' }}>
        <Link to="/aesthetics" className="view-all-link">view all aesthetics →</Link>
      </p>
      <Lightbox art={lightbox} onClose={() => setLightbox(null)} />
    </>
  )
}

// ─── Full Page Components ────────────────────────────────────────────────────

function HomePage() {
  return (
    <div className="central-column">
      <ProfileSection />
      <ResumePreview />
      <WritingPreview />
      <ThoughtsPreview />
      <AestheticsPreview />
      <p>
        This website remix is based on Oscar Moxon's open source site and personalized
        with content from{' '}
        <CustomLink href="https://github.com/Zxch-Chen/newPersonalWebsite">
          my website code
        </CustomLink>.
      </p>
    </div>
  )
}

function ResumePage() {
  return (
    <div className="central-column">
      <ProfileSection />

      <h2 className="post-list-heading">[resume]</h2>

      <div className="resume-full">
        <h3 className="resume-section-heading">Education</h3>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>Harvard University</strong>
            <span className="resume-entry-date">Sep 2024 — May 2028</span>
          </div>
          <p className="resume-entry-subtitle">B.S. Computer Science, Secondary in Philosophy</p>
          <p className="resume-entry-detail">
            <strong>Coursework:</strong> Algorithms &amp; Data Structures (CS 120, CS 124),
            Distributed Systems (CS 262), Systems Programming (CS 61),
            Artificial Intelligence (CS 182), Proof-Based Linear Algebra (Math 22a),
            Multivariable Calculus (Math 21a), Probability (Stat 110),
            Statistics &amp; Inference (Stat 111).
          </p>
        </div>

        <h3 className="resume-section-heading">Now</h3>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://trycirca.org">Circa</a> — Cofounder
            </strong>
            <span className="resume-entry-date">2026 — Present</span>
          </div>
          <p className="resume-entry-detail">
            Creating a more authentic space for close friends — a friends-first mobile
            network built around relational depth rather than engagement metrics, for
            college students and people in their twenties.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>ML Projects</strong>
            <span className="resume-entry-date">Ongoing</span>
          </div>
          <p className="resume-entry-detail">
            Independent work on mechanistic interpretability, sparse autoencoders,
            representation steering, LLM evaluation, and supervised fine-tuning of small
            models — plus reproducible eval pipelines for measuring factual-recall failures.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>Thinking about the future and human flourishing</strong>
            <span className="resume-entry-date">Ongoing</span>
          </div>
          <p className="resume-entry-detail">
            Reading and writing on where technology is taking us and what a good life looks
            like inside it — ambition, friendship, morality, and agency. Published at{' '}
            <a href="https://zachchen.substack.com/">Towards the North Star</a>.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>AI Safety Student Team — Member</strong>
            <span className="resume-entry-date">Feb 2026 — Present</span>
          </div>
          <p className="resume-entry-detail">
            Technical AI safety workshop at Harvard.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>SpaceXAI — Campus Lead</strong>
            <span className="resume-entry-date">Sep 2025 — Present</span>
          </div>
          <p className="resume-entry-detail">
            Growing SpaceXAI at Harvard — developer adoption, product feedback, and
            programming for technical students.
          </p>
        </div>

        <h3 className="resume-section-heading">Early-Stage Investing</h3>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://embedding.vc/">Embedding VC</a> — Scout
            </strong>
            <span className="resume-entry-date">Sep 2025 — Present</span>
          </div>
          <p className="resume-entry-detail">
            Technical diligence on early-stage AI and deep-tech companies: model architecture,
            infrastructure, data advantages, and product defensibility.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>V11 — Venture Partner</strong>
            <span className="resume-entry-date">Mar 2026 — Present</span>
          </div>
          <p className="resume-entry-detail">
            Sourcing and evaluating high-potential technology companies for leading venture
            firms as part of a selective network of operators, founders, and researchers.
            Technical and market diligence on early-stage AI and software startups.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://tnt.so">TNT</a> — Operator
            </strong>
            <span className="resume-entry-date">2026 — Present</span>
          </div>
          <p className="resume-entry-detail">
            Operations for a Harvard/MIT accelerator: working with technical founders on
            formation, product strategy, fundraising, and GTM; sourcing founders and connecting
            companies to operators and investors across the ecosystem.
          </p>
        </div>

        <h3 className="resume-section-heading">Previously</h3>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://sapentia.ai">Sapentia AI</a> — Cofounder
            </strong>
            <span className="resume-entry-date">Jan 2026 — 2026</span>
          </div>
          <p className="resume-entry-detail">
            Architected a multi-agent admissions platform on Next.js, TypeScript, the OpenAI
            Agent SDK, LangChain, PostgreSQL, and pgvector — routing, tool use, RAG, structured
            outputs, persistent user memory. Deployed containerized inference and app services
            on AWS ECS/Fargate behind an ALB with streaming APIs, rate limiting, and PII-safe
            observability. Built LLM evals for factuality, plan quality, safety, and
            prompt-injection resistance. 750+ waitlist users; led a 40+ person team.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>Alex AI — GTM</strong>
            <span className="resume-entry-date">Jun 2026 — Aug 2026</span>
          </div>
          <p className="resume-entry-detail">
            Built a Python content-orchestration pipeline that ingests blogs, videos, customer
            stories, and internal metrics, generates channel-specific content with Claude, and
            publishes through the Ordinal API — with an automated brand-QA and revision loop
            that checks factual, stylistic, and positioning constraints before scheduling.
            Built a Remotion/React rendering system for branded clips, vertical shorts, lower
            thirds, and quote cards, plus{' '}
            <a href="https://ta20awards.com">ta20awards.com</a> and internal content tooling.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>Cursor Growth @ Harvard</strong>
            <span className="resume-entry-date">2025</span>
          </div>
          <p className="resume-entry-detail">
            Grew Cursor's usage across the Harvard builder ecosystem: student adoption,
            product feedback, and AI-native developer workflows.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>IvyLine Consulting — Cofounder &amp; CSO</strong>
            <span className="resume-entry-date">2024 — 2025</span>
          </div>
          <p className="resume-entry-detail">
            Ran ops, consulting, marketing, and sales. Scaled to five figures of profit in
            year one.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://www.mgh.harvard.edu">MGH</a> / Harvard Medical School — Computational Genomics
            </strong>
            <span className="resume-entry-date">2021 — 2025</span>
          </div>
          <p className="resume-entry-detail">
            Principal investigator. Python and R pipelines to clean, normalize, and validate
            genomic data across 1,000+ patient profiles (~80% less manual processing).
            Logistic regression, covariate adjustment, AUROC, and permutation-based
            multiple-testing correction to find markers of Alzheimer's risk. Co-authored work
            accepted at AAIC 2024.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>Unity Network — Founder</strong>
            <span className="resume-entry-date">Jun 2023 — May 2024</span>
          </div>
          <p className="resume-entry-detail">
            Built a national organization helping students with research. Distributed
            resources to 100 Title I schools, partnered with 3 state fairs, and ran leaders
            in 10+ states.
          </p>
        </div>

        <h3 className="resume-section-heading">Projects</h3>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://github.com/Zxch-Chen/cua-privacy-layer">
                PLVA — Privacy Layer for Visual Agents
              </a>
            </strong>
            <span className="resume-entry-date">Jul 2026</span>
          </div>
          <p className="resume-entry-subtitle">
            Python · TypeScript · ONNX · RapidOCR · MiniLM · Playwright · Core ML
          </p>
          <p className="resume-entry-detail">
            1st place at the H Company Computer Use Agent Hackathon. A local, fail-closed
            privacy layer for autonomous browser agents: an OpenAI-compatible loopback proxy
            around HoloDesktop's closed runtime that rewrites screenshots and model actions
            bidirectionally with session-scoped placeholders and hide-use / approval / blocked
            policies. Fuses an ONNX visual detector, RapidOCR, deterministic credential and
            card rules, and a quantized semantic PII classifier — irreversible masks for
            passwords, CVCs, and card numbers before frames reach the model. Fine-tuned a
            MiniLM-L6-H384 BIO tagger on Modal over 4k synthetic screen/OCR samples, with an
            INT8 ONNX deployment path. A Playwright harness separates privacy leakage from task
            capability.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://www.howtowantbetterthings.org/">How to Want Better Things</a> — Co-Author
            </strong>
            <span className="resume-entry-date">Sep 2025 — Apr 2026</span>
          </div>
          <p className="resume-entry-detail">
            A book on career choice and moral ambition. Led launch strategy; presented at
            Brown, Yale, and Tufts.
          </p>
        </div>
        <div className="resume-entry">
          <div className="resume-entry-header">
            <strong>
              <a href="https://zachchen.substack.com/">Towards the North Star</a> — Author
            </strong>
            <span className="resume-entry-date">Jan 2025 — Present</span>
          </div>
          <p className="resume-entry-detail">
            Essays on technology, history, ambition, and individual agency in a world shaped by
            rapidly changing social and technical systems.
          </p>
        </div>

        <h3 className="resume-section-heading">Technical Skills</h3>
        <div className="resume-entry">
          <p className="resume-entry-detail">
            <strong>Languages:</strong> Python, TypeScript, JavaScript, SQL, R.
          </p>
          <p className="resume-entry-detail">
            <strong>Machine learning:</strong> PyTorch, Transformers, ONNX Runtime, supervised
            fine-tuning, BIO sequence tagging, synthetic data generation, mechanistic
            interpretability, sparse autoencoders, representation steering, LLM evaluation, RLHF.
          </p>
          <p className="resume-entry-detail">
            <strong>Agents &amp; applied AI:</strong> OpenAI Agent SDK, LangChain, computer-use
            agents, tool calling, RAG, vector search, structured generation, prompt-injection
            defense, PII detection and redaction, local inference.
          </p>
          <p className="resume-entry-detail">
            <strong>Backend &amp; infra:</strong> FastAPI, Node.js, PostgreSQL, Supabase,
            pgvector, Docker, AWS ECS/Fargate, ALB, Vercel, Modal.
          </p>
          <p className="resume-entry-detail">
            <strong>Frontend &amp; testing:</strong> Next.js, React, Remotion, Vite, Playwright,
            Vitest, pytest.
          </p>
          <p className="resume-entry-detail">
            <strong>Tools:</strong> Git, Linux, Claude Code, Cursor, Codex.
          </p>
        </div>

        <h3 className="resume-section-heading">Elsewhere</h3>
        <p>
          <a href="https://www.linkedin.com/in/zachary-chen31415/">LinkedIn</a> ·{' '}
          <a href="https://github.com/Zxch-Chen">GitHub</a> ·{' '}
          <a href="https://zachchen.substack.com/">Substack</a> ·{' '}
          <a href="https://x.com/theZachChen">X</a> ·{' '}
          <a href="mailto:zach.chen101@gmail.com">zach.chen101@gmail.com</a>
        </p>
      </div>
    </div>
  )
}

function WritingPage() {
  const { posts, loading } = useSubstackPosts()
  const allWriting = posts.length > 0
    ? posts.map(p => ({ title: p.title, link: p.link, date: p.pubDate }))
    : HARDCODED_WRITING

  return (
    <div className="central-column">
      <ProfileSection />

      <h2 className="post-list-heading">[writing]</h2>
      <p className="civilisation-lead">
        All writing from{' '}
        <CustomLink href="https://zachchen.substack.com/">Towards the North Star</CustomLink>
        : thoughts, essays, and deep-dives ranging from the macro to the micro.
      </p>

      {loading ? (
        <p className="background-text">Loading posts...</p>
      ) : (
        <ul className="favourite-essays">
          {allWriting.map((post) => (
            <li key={post.link}>
              <span className="essay-date">{post.date},</span>{' '}
              <a href={post.link} target="_blank" rel="noopener noreferrer">{post.title}</a>
            </li>
          ))}
        </ul>
      )}

      <p className="background-text">
        Read everything on{' '}
        <CustomLink href="https://zachchen.substack.com/">Substack</CustomLink>.
      </p>
    </div>
  )
}

function ThoughtsPage() {
  return (
    <div className="central-column">
      <ProfileSection />

      <h2 className="post-list-heading">[thoughts]</h2>
      <p className="civilisation-lead">
        A small commonplace book of ideas, scripture, and fragments worth returning to.
      </p>
      <ul className="beliefs">
        {ALL_THOUGHTS.map((thought, i) => (
          <li key={i}>
            {thought.text}
            {thought.source && <> — {thought.source}</>}
          </li>
        ))}
      </ul>

      <h2 className="post-list-heading" style={{ marginTop: '2.5rem' }}>[problems worth solving]</h2>
      <p className="civilisation-lead">problems I want to see solved or help solve.</p>
      <ul className="beliefs">
        {ALL_PROBLEMS.map((problem, i) => (
          <li key={i}>
            <strong>{problem.title}.</strong> {problem.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AestheticsPage() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <div className="central-column">
      <ProfileSection />

      <h2 className="post-list-heading">[aesthetics worth remembering]</h2>
      <p className="civilisation-lead">
        A collection of art, photography, and moments worth holding onto.
      </p>
      <ArtGrid arts={ALL_ARTS} onSelect={setLightbox} />
      <Lightbox art={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, toggleTheme] = useDarkMode()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <style>{`
        [data-theme="dark"] {
          --background-color: #141414;
          --text-color: #e8f3ff;
          --link-color: #c89b7b;
          --border-color: #172334;
          --brand-color: #c89b7b;
          --site-title-color: #e8f3ff;
          --profile-frame-color: transparent;
          --toc-accent: #c89b7b;
        }
        [data-theme="light"] {
          --background-color: #ffffff;
          --text-color: #2A1A1A;
          --link-color: #7A2E2E;
          --border-color: #D4C0B0;
          --code-background: #EDE3D7;
          --blockquote-color: #6b4040;
          --brand-color: #7A2E2E;
          --recent-essays-bg: #EDE3D7;
          --recent-essays-border: #D4C0B0;
          --site-title-color: #2A1A1A;
          --bullet-color: #2A1A1A;
          --profile-frame-color: rgba(122, 46, 46, 0.18);
          --toc-accent: #7A2E2E;
        }
        [data-theme="dark"] body { background: #141414; }
        [data-theme="light"] body { background: #ffffff; }
        [data-theme="dark"] .site-nav .nav-item,
        [data-theme="dark"] .site-nav .page-link,
        [data-theme="dark"] .site-nav .menu-icon,
        [data-theme="dark"] .nav-overlay-close,
        [data-theme="dark"] .custom-link,
        [data-theme="dark"] .custom-link-number,
        [data-theme="dark"] .footer-brand,
        [data-theme="dark"] .footer-socials a,
        [data-theme="dark"] a:not(.essay-card):not(.custom-link):not(.heading-link) {
          color: #c89b7b !important;
          text-decoration-color: #c89b7b !important;
        }
        [data-theme="light"] .site-nav .nav-item,
        [data-theme="light"] .site-nav .page-link,
        [data-theme="light"] .custom-link,
        [data-theme="light"] .custom-link-number,
        [data-theme="light"] .footer-brand,
        [data-theme="light"] .footer-socials a,
        [data-theme="light"] a:not(.essay-card):not(.custom-link):not(.heading-link) {
          color: #7A2E2E !important;
          text-decoration-color: #7A2E2E !important;
        }
        [data-theme="dark"] .site-nav .page-link::after { background-color: #c89b7b; }
        [data-theme="light"] .site-nav .page-link::after { background-color: #7A2E2E; }
        [data-theme="light"] .resume-citation { color: #7A2E2E; }
        input:checked + .slider { border-color: #c89b7b; }
        input:checked + .slider:before { background-color: #c89b7b; }
        .profile-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .homepage-profile {
          display: block;
          margin-left: 0;
          margin-bottom: 0;
        }
        .homepage-profile::before { display: none; }
        .homepage-profile img {
          border-radius: 18px;
          object-position: center 32%;
          box-shadow: 0 0 0 1px rgba(200,155,123,0.22), 0 18px 50px rgba(0,0,0,0.35);
        }
        .footer-profile-icon { border-radius: 8px; }
        .old-style-btn {
          display: inline-block;
          font-family: "Lora", Georgia, serif;
          font-size: 0.78rem;
          color: var(--text-color) !important;
          opacity: 0.4;
          text-decoration: none !important;
          border: none;
          padding: 0;
          transition: opacity 0.2s ease;
          letter-spacing: 0.01em;
          flex-shrink: 0;
          margin-bottom: 6px;
        }
        .old-style-btn:hover {
          opacity: 0.75;
        }
        .view-all-link {
          font-family: "Lora", Georgia, serif;
          font-size: 0.88rem;
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }
        .view-all-link:hover {
          opacity: 1;
        }
        .resume-citation {
          position: relative; display: inline-block; margin-left: 0.2em;
          color: #c89b7b; cursor: help; font-size: 0.72em; line-height: 0;
          text-decoration: underline; text-decoration-thickness: 1px;
          text-underline-offset: 2px; vertical-align: super;
        }
        .resume-citation-popover {
          position: absolute; left: 50%; bottom: 130%; z-index: 1000;
          display: none; width: min(260px, 80vw); transform: translateX(-50%);
          border: 1px solid var(--border-color); border-radius: 6px;
          background: var(--background-color); box-shadow: 0 8px 24px rgba(0,0,0,0.28);
          color: var(--text-color); font-family: "Lora", Georgia, serif;
          font-size: 0.78rem; font-weight: 400; line-height: 1.45;
          padding: 0.6rem 0.75rem; text-align: left;
        }
        .resume-citation:hover .resume-citation-popover,
        .resume-citation:focus .resume-citation-popover { display: block; }
        .resume-full {
          margin-top: 0.5rem;
        }
        .resume-section-heading {
          font-family: "Lora", Georgia, serif;
          font-size: 1.05rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.35rem;
          border-bottom: 1px solid var(--border-color);
        }
        .resume-entry {
          margin-bottom: 1.25rem;
        }
        .resume-entry-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .resume-entry-date {
          font-family: "Lora", Georgia, serif;
          font-size: 0.82rem;
          opacity: 0.55;
          white-space: nowrap;
        }
        .resume-entry-subtitle {
          font-size: 0.9rem;
          opacity: 0.7;
          margin-top: 0.15rem;
          margin-bottom: 0.25rem;
        }
        .resume-entry-detail {
          font-size: 0.92rem;
          line-height: 1.55;
          margin-top: 0.25rem;
        }
        .site-footer {
          background-color: var(--background-color);
        }
        .footer-headshot {
          background-color: var(--background-color);
        }
      `}</style>

      <Header theme={theme} onToggle={toggleTheme} />

      <main className="page-content" aria-label="Content">
        <div className="wrapper">
          <article className="post">
            <header className="post-header">
              <h1 className="post-title"></h1>
            </header>

            <div className="post-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/writing" element={<WritingPage />} />
                <Route path="/thoughts" element={<ThoughtsPage />} />
                <Route path="/aesthetics" element={<AestheticsPage />} />
              </Routes>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}
