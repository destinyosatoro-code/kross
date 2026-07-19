/* ============================================================
   AI & App Development Concepts — script.js
   Vanilla JS. No frameworks. No build step.
   Sections: 1) Content data  2) Rendering  3) Navigation
             4) Quiz logic     5) Confetti    6) Background canvas
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. CONTENT DATA
     Each topic drives its own slide + quiz question.
  --------------------------------------------------------- */
  const topics = [
    {
      id: "mcp",
      icon: "🔌",
      title: "MCP (Model Context Protocol)",
      meaning: [
        "MCP is a shared language that lets an AI assistant talk to outside tools and data sources, like your files, a calendar, or a database.",
        "Without it, every app would need its own custom, one-off code just to let an AI use that tool. MCP replaces all those one-off connections with a single standard.",
        "An 'MCP server' sits between the AI and the real tool. The AI sends a request through this standard format, and the server carries it out and sends back the result."
      ],
      example: "Think of a universal travel adapter. Instead of buying a different plug for every country, one adapter fits any wall socket. MCP works the same way: instead of a different custom connection for every tool, one standard protocol fits any of them.",
      why: [
        "Lets one AI assistant connect to many different apps without custom-built integrations for each one",
        "Keeps access to sensitive tools and data controlled and permissioned",
        "Saves developers time — build the connector once, reuse it everywhere",
        "Powers features like an AI reading your files, checking a calendar, or querying a database on your behalf"
      ],
      diagram: `
        <div class="diagram-node">Your App</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node accent">MCP Server</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node">Database / Tool</div>
      `,
      facts: [
        { color: "blue", label: "Full name", text: "Model Context Protocol" },
        { color: "purple", label: "Open standard", text: "Any AI app can implement it, not locked to one company" },
        { color: "cyan", label: "Role", text: "Acts as a bridge between AI and real-world tools" },
        { color: "green", label: "Reusable", text: "One MCP server can serve many different AI apps" }
      ],
      summary: "MCP gives AI assistants one standard way to safely connect with outside tools and data.",
      quiz: {
        q: "What does MCP mainly help an AI assistant do?",
        options: [
          "Talk to external tools and data sources in a standard way",
          "Make its writing style more creative",
          "Automatically increase its context window",
          "Encrypt a user's saved passwords"
        ],
        correct: 0
      }
    },
    {
      id: "context-window",
      icon: "🪟",
      title: "Context Window",
      meaning: [
        "The context window is how much conversation an AI can 'keep in mind' at once — its short-term memory for the current chat.",
        "It's measured in tokens, not words or messages. Every reply, plus your whole message history, has to fit inside that limit.",
        "Once a conversation grows past that limit, the oldest parts start getting pushed out to make room for the newest ones."
      ],
      example: "Imagine your own short-term memory in a long phone call. You can clearly recall the last few things someone said, but if the call runs long, the very beginning starts to fade. AI works in a similar way — it can lose track of the earliest messages once a conversation gets too long.",
      why: [
        "Determines how much conversation history the AI can actually consider at once",
        "Affects speed and cost — larger windows mean more data to process per reply",
        "Long documents or codebases need to fit inside the window to be fully understood",
        "Developers design apps to summarize or trim older content so key details aren't lost"
      ],
      diagram: `
        <div class="diagram-node">Conversation</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-row">
          <div class="diagram-node faint">Old Messages</div>
          <div class="diagram-node good">Recent Messages</div>
        </div>
      `,
      facts: [
        { color: "blue", label: "Unit", text: "Measured in tokens, not words" },
        { color: "purple", label: "Varies", text: "Some models hold a few thousand tokens, others far more" },
        { color: "amber", label: "Cost", text: "A bigger window generally means more expensive processing" },
        { color: "green", label: "Overflow", text: "Once full, the oldest content is dropped or summarized" }
      ],
      summary: "The context window is how much text an AI can hold in mind during one conversation.",
      quiz: {
        q: "What typically happens when a conversation goes past the context window?",
        options: [
          "The earliest parts of the conversation get forgotten",
          "The app crashes permanently",
          "The AI remembers everything forever",
          "The AI automatically switches languages"
        ],
        correct: 0
      }
    },
    {
      id: "token",
      icon: "🧩",
      title: "Token",
      meaning: [
        "AI models don't read text the way people do. They break it into smaller pieces called tokens — sometimes a whole word, sometimes just part of one.",
        "A short, common word might be a single token. A longer or unusual word might be split into two or three pieces.",
        "Every prompt you send and every reply you get is counted in tokens, which is why token counts show up in pricing and limits."
      ],
      example: "The word 'unbelievable' might be broken into pieces like 'un', 'believ', and 'able'. Meanwhile, a short common word like 'cat' usually stays as one whole token.",
      why: [
        "Pricing for most AI APIs is based on the number of tokens used, not characters or words",
        "Context window limits are measured in tokens, so token counts decide how much text fits",
        "Some languages and emoji use more tokens per word than plain English",
        "Understanding tokens helps developers estimate cost and message length ahead of time"
      ],
      diagram: `
        <div class="diagram-node">"I love pizza"</div>
        <div class="diagram-arrow">↓ splits into ↓</div>
        <div class="diagram-row">
          <div class="diagram-node accent">I</div>
          <div class="diagram-node accent">love</div>
          <div class="diagram-node accent">pizza</div>
        </div>
      `,
      facts: [
        { color: "blue", label: "Rule of thumb", text: "About 4 characters of English text ≈ 1 token" },
        { color: "purple", label: "Both directions", text: "Input text and output text both use up tokens" },
        { color: "cyan", label: "Model-specific", text: "Token limits differ from one AI model to another" },
        { color: "amber", label: "Hidden cost", text: "Punctuation and spaces can count as tokens too" }
      ],
      summary: "Tokens are the small chunks of text that AI models actually read and generate.",
      quiz: {
        q: "Roughly how much English text is one token?",
        options: [
          "About 4 characters",
          "Exactly one full sentence",
          "A whole paragraph",
          "10 words"
        ],
        correct: 0
      }
    },
    {
      id: "inference",
      icon: "🧠",
      title: "Inference",
      meaning: [
        "Inference is the moment a trained AI model actually generates a response to your prompt.",
        "The model isn't looking up a stored answer. It's predicting the most likely next token, over and over, based on everything it learned during training.",
        "This happens every single time you send a message — the model runs inference to produce its reply, live."
      ],
      example: "It's similar to the autocomplete on your phone keyboard guessing your next word — except far more advanced, predicting whole paragraphs one likely piece of text at a time.",
      why: [
        "Every AI reply, from chatbots to coding assistants, is produced through inference",
        "Inference speed and cost shape how apps are built, such as streaming a reply word by word",
        "Developers pick different models depending on how fast or accurate inference needs to be",
        "Understanding inference explains why AI can be wrong sometimes — it's predicting, not recalling facts"
      ],
      diagram: `
        <div class="diagram-node">Your Prompt</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node accent">Model Predicts Next Tokens</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node">Generated Response</div>
      `,
      facts: [
        { color: "blue", label: "Timing", text: "Inference happens after training is already finished" },
        { color: "green", label: "Speed", text: "Faster inference means quicker replies for users" },
        { color: "purple", label: "Trade-off", text: "Larger models are generally slower per prediction" },
        { color: "cyan", label: "Term", text: "Servers that run this step are called inference endpoints" }
      ],
      summary: "Inference is the step where a trained AI model turns your prompt into a predicted response.",
      quiz: {
        q: "What best describes inference?",
        options: [
          "Generating a response by predicting likely text",
          "Training a model on brand-new data",
          "Deleting outdated data from a database",
          "Encrypting messages between a user and a server"
        ],
        correct: 0
      }
    },
    {
      id: "pat",
      icon: "🎟️",
      title: "PAT (Personal Access Token)",
      meaning: [
        "A Personal Access Token, or PAT, is a special code that stands in for your password when a tool or script needs to access your account.",
        "Unlike a password, a PAT can be limited to only certain permissions — for example, read-only access to one part of an account.",
        "If a PAT is ever exposed, it can be revoked instantly without needing to change your actual account password."
      ],
      example: "It's like a hotel keycard instead of your house key. The keycard only opens your room and maybe the gym, and the hotel can deactivate it any time — without ever needing to change the locks on your real front door.",
      why: [
        "Lets apps and scripts access your account without ever knowing your real password",
        "Can be scoped to only what's needed, such as read-only access",
        "Easy to revoke immediately if leaked, without touching your main password",
        "Commonly used to connect tools like GitHub Actions, command-line tools, or CI/CD pipelines"
      ],
      diagram: `
        <div class="diagram-node">Developer</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node accent">Personal Access Token</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node">GitHub</div>
      `,
      facts: [
        { color: "blue", label: "Scoped", text: "Can be limited to specific permissions only" },
        { color: "amber", label: "Expiring", text: "Many PATs can be set to expire automatically" },
        { color: "red", label: "Keep private", text: "Should never be committed to public code" },
        { color: "purple", label: "Related idea", text: "Similar in purpose to OAuth tokens, used differently" }
      ],
      summary: "A PAT lets tools access your account safely, without ever exposing your real password.",
      quiz: {
        q: "Why are PATs generally considered safer than sharing a password?",
        options: [
          "They can be scoped and revoked without changing your password",
          "They never expire under any circumstance",
          "They always grant full, unrestricted account access",
          "They replace the need for any login entirely"
        ],
        correct: 0
      }
    },
    {
      id: "auth",
      icon: "🔐",
      title: "Authentication (Auth)",
      meaning: [
        "Authentication is the process of proving who you are before an app lets you in — the classic example being a username and password.",
        "Modern apps often use methods like 'Sign in with Google', known as OAuth, so you can log in without creating yet another password.",
        "Once you're verified, apps often use a JWT (JSON Web Token) — a small signed piece of data that proves your identity without checking the database on every single request."
      ],
      example: "It's like showing your ID at airport security once, then receiving a boarding pass. From then on, staff just check that pass instead of re-verifying your passport at every single gate.",
      why: [
        "Protects private accounts and user data from unauthorized access",
        "OAuth lets an app offer 'Sign in with Google or GitHub' without ever seeing your password",
        "JWTs let servers verify identity quickly using a signed token instead of a database lookup every time",
        "Weak authentication design is one of the most common security vulnerabilities in real apps"
      ],
      diagram: `
        <div class="diagram-node">Enter Credentials</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node">Server Verifies Identity</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node accent">Access Token Issued</div>
      `,
      facts: [
        { color: "blue", label: "OAuth", text: "A delegation protocol, not a login system by itself" },
        { color: "purple", label: "JWT", text: "Stands for JSON Web Token" },
        { color: "red", label: "Best practice", text: "Passwords should always be hashed, never stored in plain text" },
        { color: "green", label: "Extra layer", text: "Multi-factor authentication adds security beyond passwords" }
      ],
      summary: "Authentication confirms who you are before an app lets you in.",
      quiz: {
        q: "What does OAuth commonly let a user do?",
        options: [
          "Sign in using another trusted account, like Google, without sharing a password",
          "Encrypt an entire hard drive",
          "Increase an AI model's context window",
          "Compress files before uploading"
        ],
        correct: 0
      }
    },
    {
      id: "migration",
      icon: "📦",
      title: "Migration",
      meaning: [
        "A migration is a controlled, tracked change to a database's structure — like adding a table or changing a column — without losing the data already there.",
        "Instead of editing a live database by hand, developers write migration scripts that describe exactly what should change.",
        "Those scripts are run in order, so every environment — a developer's laptop, a test server, and the live app — end up with the same database structure."
      ],
      example: "It's like renovating a house room by room while people still live in it, instead of demolishing the whole building and starting over.",
      why: [
        "Apps evolve over time, and databases must evolve with them without losing existing data",
        "Migrations are written as versioned scripts, so changes can be tracked and, often, reversed",
        "Well-written migrations avoid downtime when a live app is updated",
        "Tools built around Supabase or PostgreSQL can automate this process safely"
      ],
      diagram: `
        <div class="diagram-node">Database v1</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node accent">Migration</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node">Database v2</div>
      `,
      facts: [
        { color: "blue", label: "Reversible", text: "Good migrations can often be undone if something goes wrong" },
        { color: "amber", label: "Test first", text: "Always test a migration on a copy before running it live" },
        { color: "purple", label: "Team sync", text: "Migration files keep every teammate's database in sync" },
        { color: "red", label: "Risk", text: "Skipping migrations can break an app for existing users" }
      ],
      summary: "Migration safely updates a database's structure without losing existing data.",
      quiz: {
        q: "What is the main goal of a database migration?",
        options: [
          "Changing the database structure safely without losing existing data",
          "Permanently deleting old records",
          "Making queries run in parallel automatically",
          "Encrypting a full database backup"
        ],
        correct: 0
      }
    },
    {
      id: "rls",
      icon: "🛡️",
      title: "RLS (Row Level Security)",
      meaning: [
        "Row Level Security is a database feature that limits which rows of a table a user can see or edit — enforced by the database itself.",
        "This matters because many apps store every user's data in the very same shared table.",
        "Even if a query technically asks for everything, RLS quietly filters the results down to only what that specific user is allowed to access."
      ],
      example: "It's like a shared office building where everyone has a keycard, but each card only opens the door to your own office — never anyone else's, even though everyone's office is in the same building.",
      why: [
        "Ensures users only see their own data, even if a query technically requests everything",
        "Adds a safety net at the database level, in case there's a bug in the app's own code",
        "Common in apps built on Supabase, where many users share the same underlying tables",
        "Helps prevent accidental data leaks between different users of the same product"
      ],
      diagram: `
        <div class="diagram-node">Shared Table (All Rows)</div>
        <div class="diagram-arrow">↓ filtered by ↓</div>
        <div class="diagram-node accent">Row Level Security</div>
        <div class="diagram-arrow">↓</div>
        <div class="diagram-node good">User Sees Only Their Own Rows</div>
      `,
      facts: [
        { color: "blue", label: "Enforced by", text: "The database engine itself, not just app code" },
        { color: "purple", label: "Popular in", text: "Postgres-based backends such as Supabase" },
        { color: "cyan", label: "Mechanism", text: "Security policies tied to the logged-in user" },
        { color: "red", label: "Without it", text: "A single app bug could expose every user's data" }
      ],
      summary: "RLS keeps every user limited to only their own data, enforced right inside the database.",
      quiz: {
        q: "What does Row Level Security control?",
        options: [
          "Which rows of data a user is allowed to see or edit",
          "How fast a database runs queries",
          "The visual theme of an application",
          "The token limit of an AI model"
        ],
        correct: 0
      }
    }
  ];

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  // slide 0 = home, 1..N = topics, N+1 = certificate
  const TOTAL_SLIDES = topics.length + 2;
  const CERT_INDEX = TOTAL_SLIDES - 1;

  let current = 0;
  let visited = new Set();
  let quizAnswered = {}; // topicId -> boolean answered
  let score = 0;
  let quizTotal = topics.length;

  /* ---------------------------------------------------------
     DOM REFS
  --------------------------------------------------------- */
  const slidesEl = document.getElementById("slides");
  const sidebarList = document.getElementById("sidebarList");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  const progressBarWrap = document.getElementById("progressBar");
  const slideNumberEl = document.getElementById("slideNumber");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const scoreText = document.getElementById("scoreText");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const homeBtn = document.getElementById("homeBtn");

  /* ---------------------------------------------------------
     2. RENDERING
  --------------------------------------------------------- */
  function buildHomeSlide() {
    const chips = topics.map(t => `<span>${t.icon} ${t.title.split("(")[0].trim()}</span>`).join("");
    return `
      <div class="slide" data-slide="0">
        <div class="home-slide">
          <div class="home-slide__eyebrow">8 Core Concepts</div>
          <h1>AI &amp; App Development Concepts</h1>
          <p class="home-slide__sub">Understanding the building blocks behind modern AI applications.</p>
          <div class="home-topics">${chips}</div>
          <button class="start-btn" id="startLearningBtn">Start Learning <span aria-hidden="true">→</span></button>
        </div>
      </div>
    `;
  }

  function buildTopicSlide(topic, idx) {
    const factColorVar = { blue: "var(--blue)", purple: "var(--purple)", cyan: "var(--cyan)", amber: "var(--amber)", green: "var(--green)", red: "var(--red)" };
    const facts = topic.facts.map(f => `
      <div class="fact" style="border-left:3px solid ${factColorVar[f.color] || "var(--blue)"}">
        <strong>${f.label}</strong>${f.text}
      </div>
    `).join("");

    const meaningParas = topic.meaning.map(p => `<p>${p}</p>`).join("");
    const whyItems = topic.why.map(w => `<li>${w}</li>`).join("");

    return `
      <div class="slide" data-slide="${idx}" data-topic="${topic.id}">
        <div class="topic-header">
          <div class="topic-header__eyebrow">Concept ${idx} of ${topics.length}</div>
          <h2><span class="topic-header__icon">${topic.icon}</span>${topic.title}</h2>
        </div>

        <div class="grid-2">
          <div>
            <div class="card">
              <h3><span class="dot"></span>Meaning</h3>
              ${meaningParas}
            </div>
            <div class="card">
              <h3><span class="dot"></span>Simple Example</h3>
              <p>${topic.example}</p>
            </div>
          </div>
          <div>
            <div class="card diagram-card">
              <div class="diagram">${topic.diagram}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3><span class="dot"></span>Why It Matters</h3>
          <ul class="why-list">${whyItems}</ul>
        </div>

        <div class="card">
          <h3><span class="dot"></span>Quick Facts</h3>
          <div class="facts-grid">${facts}</div>
        </div>

        <div class="summary-banner">
          <span class="summary-banner__icon">✨</span>
          <span>${topic.summary}</span>
        </div>

        <div class="card quiz-card">
          <h3><span class="dot"></span>Quick Check</h3>
          <p class="quiz-question">${topic.quiz.q}</p>
          <div class="quiz-options" id="quiz-${topic.id}">
            ${topic.quiz.options.map((opt, i) => `<button class="quiz-option" data-topic="${topic.id}" data-index="${i}">${opt}</button>`).join("")}
          </div>
          <div class="quiz-feedback" id="feedback-${topic.id}" aria-live="polite"></div>
        </div>
      </div>
    `;
  }

  function buildCertificateSlide() {
    return `
      <div class="slide" data-slide="${CERT_INDEX}">
        <div class="certificate-slide">
          <div class="certificate">
            <div class="certificate__seal">🏆</div>
            <div class="certificate__eyebrow">Certificate of Completion</div>
            <h2>AI &amp; App Development Concepts</h2>
            <p>This certifies that you explored all 8 core concepts behind modern AI applications — from MCP and tokens to authentication and database security.</p>
            <div class="certificate__score">Quiz score: <b id="certScore">0 / ${quizTotal}</b></div>
            <div class="certificate__actions">
              <button class="certificate__btn primary" id="restartBtn">Restart Course</button>
              <button class="certificate__btn" id="reviewBtn">Review Topics</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAllSlides() {
    let html = buildHomeSlide();
    topics.forEach((t, i) => { html += buildTopicSlide(t, i + 1); });
    html += buildCertificateSlide();
    slidesEl.innerHTML = html;

    document.getElementById("startLearningBtn").addEventListener("click", () => goTo(1));
    document.getElementById("restartBtn").addEventListener("click", restartCourse);
    document.getElementById("reviewBtn").addEventListener("click", () => goTo(1));

    // Quiz option listeners
    topics.forEach(t => {
      const wrap = document.getElementById(`quiz-${t.id}`);
      wrap.querySelectorAll(".quiz-option").forEach(btn => {
        btn.addEventListener("click", onQuizAnswer);
      });
    });
  }

  function renderSidebar() {
    const items = topics.map((t, i) => `
      <li class="sidebar__item" data-goto="${i + 1}" role="button" tabindex="0">
        <span class="sidebar__icon">${t.icon}</span>
        <span>${t.title.split("(")[0].trim()}</span>
        <span class="sidebar__check">✓</span>
      </li>
    `).join("");
    sidebarList.innerHTML = `
      <li class="sidebar__item" data-goto="0" role="button" tabindex="0">
        <span class="sidebar__icon">🏠</span><span>Home</span><span class="sidebar__check"></span>
      </li>
      ${items}
      <li class="sidebar__item" data-goto="${CERT_INDEX}" role="button" tabindex="0">
        <span class="sidebar__icon">🏆</span><span>Certificate</span><span class="sidebar__check"></span>
      </li>
    `;
    sidebarList.querySelectorAll(".sidebar__item").forEach(item => {
      item.addEventListener("click", () => goTo(parseInt(item.dataset.goto, 10)));
      item.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(parseInt(item.dataset.goto, 10)); }
      });
    });
  }

  function updateSidebarState() {
    const items = sidebarList.querySelectorAll(".sidebar__item");
    items.forEach(item => {
      const idx = parseInt(item.dataset.goto, 10);
      item.classList.toggle("active", idx === current);
      item.classList.toggle("done", visited.has(idx) && idx !== 0 && idx !== CERT_INDEX);
    });
  }

  /* ---------------------------------------------------------
     3. NAVIGATION
  --------------------------------------------------------- */
  function goTo(index) {
    if (index < 0 || index >= TOTAL_SLIDES) return;
    current = index;
    visited.add(current);

    document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
    const target = document.querySelector(`.slide[data-slide="${current}"]`);
    if (target) target.classList.add("active");

    // slide number label
    if (current === 0) slideNumberEl.textContent = "Home";
    else if (current === CERT_INDEX) slideNumberEl.textContent = "Certificate";
    else slideNumberEl.textContent = `${current} / ${topics.length}`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === TOTAL_SLIDES - 1;

    updateProgress();
    updateSidebarState();
    closeSidebarMobile();

    if (current === CERT_INDEX) {
      document.getElementById("certScore").textContent = `${score} / ${quizTotal}`;
      launchConfetti();
    }

    slidesEl.scrollTop = 0;
  }

  function updateProgress() {
    const topicSlidesVisited = [...visited].filter(v => v >= 1 && v <= topics.length).length;
    const pct = Math.round((topicSlidesVisited / topics.length) * 100);
    progressFill.style.width = pct + "%";
    progressLabel.textContent = pct + "%";
    progressBarWrap.setAttribute("aria-valuenow", String(pct));
  }

  function restartCourse() {
    visited = new Set();
    quizAnswered = {};
    score = 0;
    scoreText.textContent = `0 / ${quizTotal}`;
    renderAllSlides();
    goTo(0);
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));
  homeBtn.addEventListener("click", () => goTo(0));

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") goTo(current + 1);
    else if (e.key === "ArrowLeft") goTo(current - 1);
    else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(CERT_INDEX);
  });

  // Touch swipe support
  let touchStartX = null;
  const stageEl = document.getElementById("main-slide");
  stageEl.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  stageEl.addEventListener("touchend", e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 55) { dx < 0 ? goTo(current + 1) : goTo(current - 1); }
    touchStartX = null;
  }, { passive: true });

  // Mobile sidebar toggle
  sidebarToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    sidebarToggle.setAttribute("aria-expanded", String(open));
  });
  function closeSidebarMobile() {
    if (window.innerWidth <= 900) {
      sidebar.classList.remove("open");
      sidebarToggle.setAttribute("aria-expanded", "false");
    }
  }

  /* ---------------------------------------------------------
     4. QUIZ LOGIC
  --------------------------------------------------------- */
  function onQuizAnswer(e) {
    const btn = e.currentTarget;
    const topicId = btn.dataset.topic;
    if (quizAnswered[topicId]) return; // already answered

    const topic = topics.find(t => t.id === topicId);
    const chosen = parseInt(btn.dataset.index, 10);
    const wrap = document.getElementById(`quiz-${topicId}`);
    const feedback = document.getElementById(`feedback-${topicId}`);
    const buttons = wrap.querySelectorAll(".quiz-option");

    quizAnswered[topicId] = true;
    buttons.forEach(b => (b.disabled = true));

    if (chosen === topic.quiz.correct) {
      btn.classList.add("correct");
      feedback.textContent = "✓ Correct! " + topic.summary;
      feedback.className = "quiz-feedback correct";
      score++;
    } else {
      btn.classList.add("wrong");
      buttons[topic.quiz.correct].classList.add("correct");
      feedback.textContent = "✗ Not quite. The correct answer is highlighted above.";
      feedback.className = "quiz-feedback wrong";
    }
    scoreText.textContent = `${score} / ${quizTotal}`;
  }

  /* ---------------------------------------------------------
     5. CONFETTI
  --------------------------------------------------------- */
  const confettiCanvas = document.getElementById("confettiCanvas");
  const cctx = confettiCanvas.getContext("2d");
  let confettiParticles = [];
  let confettiRAF = null;

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeConfettiCanvas);
  resizeConfettiCanvas();

  function launchConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#4f8dfd", "#a463f7", "#3fe0d0", "#f5a94e", "#3ed6a0", "#f2609a"];
    confettiParticles = Array.from({ length: 140 }, () => ({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * confettiCanvas.height * 0.4,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 2.5,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
    }));
    confettiCanvas.classList.add("active");
    let frames = 0;
    const maxFrames = 260;

    function step() {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiParticles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rot += p.rotSpeed;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rot * Math.PI) / 180);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cctx.restore();
      });
      frames++;
      if (frames < maxFrames) {
        confettiRAF = requestAnimationFrame(step);
      } else {
        confettiCanvas.classList.remove("active");
        cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }
    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    step();
  }

  /* ---------------------------------------------------------
     6. AMBIENT BACKGROUND NETWORK ANIMATION
  --------------------------------------------------------- */
  const bgCanvas = document.getElementById("bg-canvas");
  const bctx = bgCanvas.getContext("2d");
  let nodes = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }

  function initNodes() {
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    }));
  }

  function drawBg() {
    bctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > bgCanvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > bgCanvas.height) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          bctx.strokeStyle = `rgba(120,150,255,${0.12 * (1 - dist / 140)})`;
          bctx.lineWidth = 1;
          bctx.beginPath();
          bctx.moveTo(nodes[i].x, nodes[i].y);
          bctx.lineTo(nodes[j].x, nodes[j].y);
          bctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      bctx.fillStyle = "rgba(164,140,255,0.55)";
      bctx.beginPath();
      bctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      bctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(drawBg);
  }

  window.addEventListener("resize", () => { resizeBgCanvas(); initNodes(); });

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  function init() {
    renderAllSlides();
    renderSidebar();
    resizeBgCanvas();
    initNodes();
    if (!reduceMotion) requestAnimationFrame(drawBg);
    else drawBg();
    goTo(0);
  }

  init();
})();
