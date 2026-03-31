const flowReferenceImage = new URL("./assets/flow-reference.png", import.meta.url).href;
const promptLengthImage = new URL("./assets/product-prompt-length.webp", import.meta.url).href;
const productNextImage = new URL("./assets/product-next.svg", import.meta.url).href;
const serviceDirectionImage = new URL("./assets/service-direction.svg", import.meta.url).href;
const serviceRefreshImage = new URL("./assets/service-refresh.svg", import.meta.url).href;
const serviceLaunchImage = new URL("./assets/service-launch.svg", import.meta.url).href;

const carouselContent = {
  products: [
    {
      type: "live",
      image: flowReferenceImage,
      imageAlt: "Flow reference visual",
      title: "Flow Automator",
      description: "구글 Flow 이미지 자동생성기",
      tags: ["Auto", "Chrome Extension", "YouTube"],
      link: "./products/flow-automator.html",
    },
    {
      type: "live",
      image: promptLengthImage,
      imageAlt: "Prompt Length Matcher preview",
      title: "Prompt Length Matcher",
      description: "목표 글자 수에 정확히 맞을 때까지 문장을 자동으로 다듬어주는 프롬프트.",
      tags: ["ChatGPT", "Gemini", "Claude", "Prompt"],
      link: "./products/prompt-length-matcher.html",
    },
    {
      type: "soon",
      image: productNextImage,
      imageAlt: "Next Piece teaser",
      title: "Next Piece",
      description: "AI, Auto, YouTube, Earn",
      tag: "Comming soon",
    },
  ],
  services: [
    {
      type: "soon",
      image: serviceDirectionImage,
      imageAlt: "Service preview 01",
      title: "Openclaw Setup",
      description: "",
      tag: "Comming soon",
    },
    {
      type: "soon",
      image: serviceRefreshImage,
      imageAlt: "Service preview 02",
      title: "Next Piece",
      description: "",
      tag: "Comming soon",
    },
    {
      type: "soon",
      image: serviceLaunchImage,
      imageAlt: "Service preview 03",
      title: "Next Piece",
      description: "",
      tag: "Comming soon",
    },
  ],
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createCard(item, theme, index, total) {
  const article = document.createElement("article");
  article.className = `orbit-card theme-${theme}`;
  article.dataset.type = item.type;
  article.dataset.index = String(index);
  const cardNumber = `${String(index + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
  const tags = Array.isArray(item.tags) ? item.tags : item.tag ? [item.tag] : [];
  const tagsHtml = tags.map((label) => `<span class="card-tag">${label}</span>`).join("");
  const visualInner = item.link
    ? `<a class="card-visual-link" href="${item.link}" aria-label="${item.title} 상세 페이지 보기">
         <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" decoding="async" />
       </a>`
    : `<img src="${item.image}" alt="${item.imageAlt}" loading="lazy" decoding="async" />`;

  article.innerHTML = `
    <div class="card-visual">
      ${visualInner}
    </div>
    <div class="card-content">
      <div class="card-title-row">
        <h3>${item.title}</h3>
        <span class="card-number">${cardNumber}</span>
      </div>
      <p class="card-description">${item.description}</p>
      <div class="card-tags">${tagsHtml}</div>
    </div>
  `;

  if (!reduceMotion) {
    article.addEventListener("mousemove", (event) => {
      const rect = article.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      article.style.setProperty("--mx", `${x.toFixed(2)}%`);
      article.style.setProperty("--my", `${y.toFixed(2)}%`);
    });

    article.addEventListener("mouseleave", () => {
      article.style.setProperty("--mx", "50%");
      article.style.setProperty("--my", "36%");
    });
  }

  return article;
}

function relativePosition(index, active, total) {
  const diff = (index - active + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === total - 1) return "left";
  return "hidden";
}

function initCarousel(root) {
  const key = root.dataset.carousel;
  const theme = root.dataset.theme === "cool" ? "cool" : "warm";
  const items = carouselContent[key];
  const track = root.querySelector("[data-track]");
  const currentTitle = root.querySelector("[data-current-title]");
  const currentIndex = root.querySelector("[data-index]");
  const buttons = root.querySelectorAll("[data-dir]");
  let active = 0;
  let timer = null;

  const cards = items.map((item, index) => {
    const card = createCard(item, theme, index, items.length);
    track.appendChild(card);
    return card;
  });

  function render() {
    cards.forEach((card, index) => {
      const position = relativePosition(index, active, cards.length);
      card.classList.remove("is-left", "is-center", "is-right", "is-hidden");
      card.classList.add(`is-${position}`);
      card.setAttribute("aria-hidden", position === "center" ? "false" : "true");
    });

    if (currentTitle) currentTitle.textContent = items[active].title;
    if (currentIndex) currentIndex.textContent = `${String(active + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  }

  function go(direction) {
    active = (active + direction + items.length) % items.length;
    render();
  }

  function stopAuto() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    timer = window.setInterval(() => {
      go(1);
    }, 5200);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.dir || 0);
      go(direction);
      startAuto();
    });
  });

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);

  render();
  startAuto();
}

function initSectionObserver() {
  const sections = document.querySelectorAll(".section-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.02,
      rootMargin: "0px 0px -2% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initSectionScrollFx() {
  if (reduceMotion) return;
  const sections = Array.from(document.querySelectorAll(".section-reveal:not(.hero)"));
  if (!sections.length) return;

  let ticking = false;

  function update() {
    const viewport = window.innerHeight || 1;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const normalized = (center - viewport * 0.5) / viewport;
      const shift = Math.max(-16, Math.min(16, normalized * 20));
      section.style.setProperty("--section-shift", `${shift.toFixed(2)}px`);
    });
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

function initNavObserver() {
  const links = Array.from(document.querySelectorAll("[data-nav-link]"));
  if (!links.length) return;
  const map = new Map(links.map((link) => [link.dataset.navLink, link]));
  const sections = document.querySelectorAll("[data-section]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.section;
        links.forEach((link) => link.classList.remove("is-active"));
        if (id === "top") {
          return;
        }
        const link = map.get(id);
        if (link) {
          link.classList.add("is-active");
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-12% 0px -45% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initScrollTopButton() {
  const button = document.querySelector("[data-scroll-top]");
  if (!button) return;

  let ticking = false;

  function update() {
    const isVisible = window.scrollY > 420;
    button.classList.toggle("is-visible", isVisible);
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

function initHeroTilt() {
  const visual = document.querySelector(".hero-visual");
  const frame = document.querySelector(".hero-visual-frame");
  const sculptureTilt = document.querySelector(".hero-sculpture-tilt");
  const rippleLayer = document.querySelector("[data-hero-ripples]");
  if (!visual || !frame || !sculptureTilt || !rippleLayer) return;

  function spawnRipple(xPercent, yPercent, size = 140) {
    const ripple = document.createElement("span");
    ripple.className = "hero-ripple";
    ripple.style.setProperty("--x", `${xPercent}%`);
    ripple.style.setProperty("--y", `${yPercent}%`);
    ripple.style.setProperty("--size", `${size}px`);
    rippleLayer.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }

  function reset() {
    frame.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    sculptureTilt.style.transform = "rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
    visual.classList.remove("is-active");
    visual.style.setProperty("--hero-mx", "50%");
    visual.style.setProperty("--hero-my", "50%");
  }

  visual.addEventListener("pointerenter", () => {
    visual.classList.add("is-active");
  });

  visual.addEventListener("pointermove", (event) => {
    visual.classList.add("is-active");
    const rect = visual.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const x = px - 0.5;
    const y = py - 0.5;
    visual.style.setProperty("--hero-mx", `${(px * 100).toFixed(2)}%`);
    visual.style.setProperty("--hero-my", `${(py * 100).toFixed(2)}%`);

    if (reduceMotion) return;
    const rotateY = x * 7;
    const rotateX = y * -5;
    frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    sculptureTilt.style.transform = `rotateX(${rotateX * 1.2}deg) rotateY(${rotateY * 1.35}deg) translate3d(${x * 22}px, ${y * 18}px, 0)`;
  });

  visual.addEventListener("pointerdown", (event) => {
    const rect = visual.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    spawnRipple(xPercent, yPercent, 150 + Math.random() * 70);
  });

  visual.addEventListener("pointerleave", reset);
}

function initHeroScrollBand() {
  const band = document.querySelector("[data-hero-scroll-band]");
  if (!band) return;

  let ticking = false;

  function update() {
    const hidden = window.scrollY > Math.max(68, window.innerHeight * 0.09);
    band.classList.toggle("is-hidden", hidden);
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

function initHeroNeuralCanvas() {
  const canvas = document.querySelector("[data-neural-canvas]");
  const visual = document.querySelector(".hero-visual");
  if (!canvas || !visual) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pointer = {
    x: 0,
    y: 0,
    active: false,
  };

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let raf = null;
  let time = 0;

  const nodes = Array.from({ length: 70 }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 56 + Math.random() * 204,
    speed: (Math.random() * 0.55 + 0.25) * (Math.random() > 0.5 ? 1 : -1),
    phase: Math.random() * Math.PI * 2,
    wobble: 0.38 + Math.random() * 0.9,
    depth: 0.28 + Math.random() * 0.72,
  }));

  const flowParticles = Array.from({ length: 28 }, () => ({
    t: Math.random(),
    speed: 0.0018 + Math.random() * 0.0048,
    size: 1.2 + Math.random() * 2.4,
  }));

  const bursts = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!pointer.active) {
      pointer.x = width / 2;
      pointer.y = height / 2;
    }
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  }

  function addBurst(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    bursts.push({
      x: clientX - rect.left,
      y: clientY - rect.top,
      life: 1,
      radius: 24,
    });
  }

  function renderScene() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const driftX = pointer.active ? (pointer.x - centerX) * 0.08 : 0;
    const driftY = pointer.active ? (pointer.y - centerY) * 0.08 : 0;

    const fog = ctx.createRadialGradient(
      centerX + driftX * 0.6,
      centerY + driftY * 0.35,
      width * 0.06,
      centerX,
      centerY,
      width * 0.45
    );
    fog.addColorStop(0, "rgba(164, 186, 255, 0.22)");
    fog.addColorStop(0.45, "rgba(108, 130, 224, 0.08)");
    fog.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, width, height);

    const points = nodes.map((node, index) => {
      const theta = node.angle + time * node.speed * 0.34;
      const jitter = Math.sin(time * node.wobble + node.phase) * 22;
      const radius = node.radius + jitter;
      let x = centerX + Math.cos(theta) * radius;
      let y = centerY + Math.sin(theta * 1.2 + index * 0.07) * radius * 0.76;

      if (pointer.active) {
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 170) {
          const force = (1 - dist / 170) * 13;
          x -= (dx / dist) * force;
          y -= (dy / dist) * force;
        }
      }

      return { x, y, depth: node.depth };
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist > 118) continue;
        const alphaBase = 1 - dist / 118;
        const alpha = alphaBase * alphaBase * (0.03 + (points[i].depth + points[j].depth) * 0.12);
        const boosted = pointer.active ? alpha * 1.3 : alpha;
        ctx.strokeStyle = `rgba(166, 187, 255, ${boosted.toFixed(4)})`;
        ctx.lineWidth = 1 + alphaBase * 0.35;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }

    ctx.beginPath();
    for (let s = 0; s < 150; s += 1) {
      const p = s / 149;
      const angle = p * Math.PI * 2.45 + time * 0.22;
      const radius = 60 + p * 245;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle * 0.9) * radius * 0.35;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(188, 208, 255, 0.24)";
    ctx.lineWidth = 1.35;
    ctx.stroke();

    flowParticles.forEach((particle) => {
      const speedBoost = pointer.active ? 1.8 : 1;
      particle.t = (particle.t + particle.speed * speedBoost) % 1;
      const angle = particle.t * Math.PI * 2.45 + time * 0.22;
      const radius = 60 + particle.t * 245;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle * 0.9) * radius * 0.35;
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232, 240, 255, 0.88)";
      ctx.fill();
    });

    points.forEach((point) => {
      const size = 1.2 + point.depth * 2.6;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 236, 255, ${(0.45 + point.depth * 0.4).toFixed(3)})`;
      ctx.fill();
    });

    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const burst = bursts[i];
      burst.life -= 0.03;
      burst.radius += 5.4;
      if (burst.life <= 0) {
        bursts.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(184, 206, 255, ${(burst.life * 0.55).toFixed(3)})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
  }

  function draw(now) {
    time = now * 0.001;
    renderScene();
    if (!reduceMotion) {
      raf = window.requestAnimationFrame(draw);
    }
  }

  visual.addEventListener("pointermove", updatePointer);
  visual.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  visual.addEventListener("pointerdown", (event) => {
    addBurst(event.clientX, event.clientY);
  });

  resize();
  draw(0);
  window.addEventListener("resize", resize);
}

document.querySelectorAll("[data-carousel]").forEach(initCarousel);
initSectionObserver();
initNavObserver();
initHeroNeuralCanvas();
initHeroTilt();
initHeroScrollBand();
initScrollTopButton();
