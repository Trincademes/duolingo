import Link from "next/link";

const languages = [
  { name: "Expo", flag: "EX", active: true },
  { name: "AWS Cloud", flag: "AWS" },
  { name: "React Native", flag: "RN" },
  { name: "Lambda", flag: "LA" },
  { name: "S3", flag: "S3" }
];

const courses = [
  { title: "Reading", subtitle: "React Native basics", tone: "lavender" },
  { title: "Listening", subtitle: "Cloud concepts", tone: "sky" },
  { title: "Speaking", subtitle: "API flows", tone: "peach" },
  { title: "Grammar", subtitle: "AWS services", tone: "mint" }
];

export default function HomePage() {
  return (
    <main className="duo-home">
      <section className="duo-shell">
        <header className="duo-topbar">
          <Link className="brand-mark" href="/">
            <span className="brand-owl" aria-hidden="true">
              <span className="brand-eye" />
              <span className="brand-eye" />
              <span className="brand-beak" />
            </span>
            <span className="brand-copy">
              <strong>DuoTech</strong>
              <small>learn tech every day</small>
            </span>
          </Link>

          <nav className="duo-nav">
            <a href="#screens">Telas</a>
            <a href="#journey">Jornada</a>
            <Link href="/dashboard">Admin</Link>
          </nav>
        </header>

        <section className="duo-hero">
          <div className="duo-hero-copy">
            <span className="hero-tag">Gamified learning for Expo + AWS</span>
            <h1>Agora sim com cara de Duolingo.</h1>
            <p>
              A home web foi redesenhada para parecer uma colecao de telas mobile: onboarding, login, dashboard,
              trilha e licao, tudo com atmosfera verde, cartoes arredondados e foco em microlicoes.
            </p>
            <div className="hero-cta">
              <a className="duo-btn duo-btn-primary" href="#screens">Ver telas</a>
              <Link className="duo-btn duo-btn-ghost" href="/dashboard">Abrir admin</Link>
            </div>
            <ul className="hero-points">
              <li>Fluxo visual inspirado no Duolingo</li>
              <li>Cursos de Expo e AWS no centro da experiencia</li>
              <li>Admin separado para nao poluir a home</li>
            </ul>
          </div>

          <div className="duo-hero-mascot">
            <div className="mascot-card">
              <div className="mascot-circle">
                <div className="mascot-head">
                  <span className="mascot-eye" />
                  <span className="mascot-eye" />
                  <span className="mascot-beak" />
                </div>
                <div className="mascot-body" />
                <div className="mascot-feet">
                  <span />
                  <span />
                </div>
              </div>
              <strong>DuoTech</strong>
              <p>Short lessons. Fast feedback. Daily streak.</p>
            </div>
          </div>
        </section>

        <section className="phones-grid" id="screens">
          <PhoneFrame className="phone-tall">
            <PhoneHeader title="Choose your path" />
            <div className="language-list">
              {languages.map((item) => (
                <div key={item.name} className={`language-row ${item.active ? "is-active" : ""}`}>
                  <span className="flag-chip">{item.flag}</span>
                  <span>{item.name}</span>
                  {item.active ? <span className="check-pill">go</span> : null}
                </div>
              ))}
            </div>
            <button className="phone-btn">keep going</button>
          </PhoneFrame>

          <PhoneFrame className="phone-hero-panel phone-center-brand">
            <div className="phone-brand-lockup">
              <div className="giant-owl">
                <span className="giant-eye" />
                <span className="giant-eye" />
                <span className="giant-beak" />
              </div>
              <h2>duotech</h2>
            </div>
          </PhoneFrame>

          <PhoneFrame>
            <PhoneHeader title="Welcome back!" subtitle="Alias Jordan" />
            <div className="challenge-banner">
              <span>Today&apos;s Challenge</span>
              <strong>Complete 1 lesson in Expo navigation</strong>
              <small>+30 XP bonus</small>
            </div>
            <div className="mini-section-head">
              <strong>Your Courses</strong>
              <a href="#journey">view all</a>
            </div>
            <div className="course-grid">
              {courses.map((course) => (
                <div key={course.title} className={`course-mini course-${course.tone}`}>
                  <div className="course-orb" />
                  <strong>{course.title}</strong>
                  <small>{course.subtitle}</small>
                </div>
              ))}
            </div>
          </PhoneFrame>

          <PhoneFrame className="phone-lesson">
            <div className="lesson-banner">
              <div>
                <small>Lesson - 01</small>
                <strong>Translate these ideas into practice</strong>
              </div>
              <span className="lesson-dots">...</span>
            </div>
            <div className="quote-card">
              <span className="quote-mark">"</span>
              <p>Expo helps you ship mobile experiences faster with less native setup.</p>
            </div>
            <div className="answer-box">
              <small>Your answer</small>
            </div>
            <button className="phone-btn">submit</button>
          </PhoneFrame>

          <PhoneFrame>
            <div className="auth-card-top">
              <div className="mini-owl">
                <span className="mini-eye" />
                <span className="mini-eye" />
                <span className="mini-beak" />
              </div>
            </div>
            <h3>Login to your account</h3>
            <div className="auth-fields">
              <div className="auth-field">Username</div>
              <div className="auth-field">Password</div>
            </div>
            <a className="auth-link" href="#journey">Forgot password?</a>
            <button className="phone-btn">login</button>
            <small className="auth-foot">Dont have an account? Sign up</small>
          </PhoneFrame>

          <PhoneFrame>
            <div className="auth-card-top">
              <div className="mini-owl">
                <span className="mini-eye" />
                <span className="mini-eye" />
                <span className="mini-beak" />
              </div>
            </div>
            <h3>Sign up your account</h3>
            <div className="auth-fields">
              <div className="auth-field">Full name</div>
              <div className="auth-field">Email</div>
              <div className="auth-field">Password</div>
            </div>
            <div className="terms-row">
              <span className="terms-check" />
              <small>I agree to terms and conditions</small>
            </div>
            <button className="phone-btn">sign up</button>
          </PhoneFrame>
        </section>

        <section className="duo-story" id="journey">
          <div className="story-card">
            <span className="story-badge">User journey</span>
            <h2>O que voce queria ver ja aparece em formato de telas.</h2>
            <p>
              Agora a home parece um produto de aprendizagem gamificada, e nao um painel tecnico. O administrador continua
              existindo em rota separada, para o projeto atender os requisitos sem perder apresentacao.
            </p>
          </div>

          <div className="story-steps">
            <div className="story-step">
              <strong>1. Cadastro e login</strong>
              <span>Entrar rapido, sem ruir a estetica mobile-first.</span>
            </div>
            <div className="story-step">
              <strong>2. Escolha de curso</strong>
              <span>Expo e AWS aparecem como trilhas principais.</span>
            </div>
            <div className="story-step">
              <strong>3. Licoes curtas</strong>
              <span>Cartoes, CTA verde e feedback visual imediato.</span>
            </div>
            <div className="story-step">
              <strong>4. Streak e progresso</strong>
              <span>Dashboard com desafio do dia e cursos ativos.</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function PhoneFrame({ children, className = "" }) {
  return <article className={`phone-frame ${className}`.trim()}>{children}</article>;
}

function PhoneHeader({ title, subtitle }) {
  return (
    <div className="phone-head">
      <div className="phone-avatar" />
      <div>
        {subtitle ? <small>{subtitle}</small> : null}
        <strong>{title}</strong>
      </div>
    </div>
  );
}
