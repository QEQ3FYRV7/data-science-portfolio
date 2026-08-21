const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const themeToggle = document.querySelector(".theme-toggle");

const internalLinks = document.querySelectorAll('a[href^="#"]');
const sections = [...document.querySelectorAll("main > section[id]")];
const hasHomeSection = sections.some((section) => section.id === "home");
const isProjectPage = document.body.classList.contains("project-page");
const revealItems = [
  ...(isProjectPage ? [] : sections),
  ...document.querySelectorAll(
    isProjectPage
      ? ".project-stat-panel"
      : ".section-heading, .profile-copy, .skill-row, .project-card, .archive-item, .contact-layout, .story-panel, .project-stat-panel, .visual-summary"
  ),
];

revealItems.forEach((item, index) => {
  item.classList.add("reveal-item");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 35}ms`);
});

const setTheme = (theme) => {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.body.dataset.theme = nextTheme;

  if (!themeToggle) return;
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "light"));
  themeToggle.setAttribute(
    "aria-label",
    nextTheme === "light" ? "Switch to dark theme" : "Switch to light theme"
  );
};

let storedTheme = null;
try {
  storedTheme = localStorage.getItem("portfolio-theme");
} catch {
  storedTheme = null;
}

setTheme(storedTheme || document.body.dataset.theme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch {
    // The toggle still works for the current page view if storage is unavailable.
  }
  setTheme(nextTheme);
});

if (!prefersReducedMotion) {
  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      document.body.classList.add("section-transitioning");
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      window.setTimeout(() => {
        document.body.classList.remove("section-transitioning");
        history.replaceState(null, "", targetId);
      }, 360);
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navLinks = [...document.querySelectorAll(".side-nav a[href^='#']")];
let scrollTicking = false;

const updateActiveSection = () => {
  const marker = window.scrollY + window.innerHeight * 0.42;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= marker) {
      activeSection = section;
    }
  });

  const activeId = activeSection?.id || "home";
  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${activeId}`;
    link.toggleAttribute("aria-current", isCurrent);
  });

  document.body.classList.toggle("content-mode", hasHomeSection && activeId !== "home");
};

const requestActiveSectionUpdate = () => {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateActiveSection();
    scrollTicking = false;
  });
};

updateActiveSection();
window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
window.addEventListener("resize", requestActiveSectionUpdate);
