(function () {
  document.documentElement.classList.add("js");

  // ── Year in footer ──
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ── Mobile nav toggle ──
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("open", !open);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
      });
    });
  }

  // ── Scroll progress bar ──
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      progressBar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // ── Section reveal on scroll ──
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ── Expandable journey cards ──
  document.querySelectorAll(".journey-card-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".journey-card");
      const body = card?.querySelector(".journey-card-body");
      if (!card || !body) return;

      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      card.setAttribute("data-expanded", String(!expanded));
      body.hidden = expanded;
    });
  });

  // ── Nav active state: class-based (not inline styles) ──
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const setActive = (id) => {
    navAnchors.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("nav-active", isActive);
      if (isActive) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.getAttribute("id"));
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  // ── Animated stat counters ──
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const statNumbers = document.querySelectorAll(".hero-stats .stat strong[data-target]");

  function animateCount(el, target, suffix, duration = 1100) {
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix; // ensure exact
      }
    }
    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    const statsContainer = document.querySelector(".hero-stats");
    if (statsContainer && "IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              statNumbers.forEach((el) => {
                if (el.dataset.animated) return;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || "";
                if (!Number.isNaN(target)) {
                  el.dataset.animated = "true";
                  animateCount(el, target, suffix);
                }
              });
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      statsObserver.observe(statsContainer);
    } else {
      // Fallback: set final values immediately
      statNumbers.forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || "";
        if (!Number.isNaN(target)) el.textContent = target + suffix;
      });
    }
  }

  // ── Skills → Projects filter / highlight (lightweight) ──
  const skillPills = document.querySelectorAll(".skill-pills span");
  const projectCards = document.querySelectorAll(".project-grid .project-card");

  if (skillPills.length && projectCards.length) {
    let currentFilter = null;

    const clearFilter = () => {
      currentFilter = null;
      projectCards.forEach((card) => card.classList.remove("is-filtered", "is-dimmed"));
      skillPills.forEach((p) => p.classList.remove("is-active-filter"));
    };

    skillPills.forEach((pill) => {
      pill.setAttribute("role", "button");
      pill.setAttribute("tabindex", "0");

      const activate = () => {
        const skillText = pill.textContent.trim().toLowerCase();

        if (currentFilter === skillText) {
          clearFilter();
          return;
        }

        currentFilter = skillText;
        skillPills.forEach((p) => p.classList.remove("is-active-filter"));
        pill.classList.add("is-active-filter");

        projectCards.forEach((card) => {
          const tags = (card.dataset.tags || "").toLowerCase();
          const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
          const matches = tags.includes(skillText) || title.includes(skillText);

          if (matches) {
            card.classList.remove("is-dimmed");
            card.classList.add("is-filtered");
          } else {
            card.classList.remove("is-filtered");
            card.classList.add("is-dimmed");
          }
        });
      };

      pill.addEventListener("click", activate);
      pill.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
        if (e.key === "Escape") clearFilter();
      });
    });

    // Optional: clicking anywhere on project grid clears filter
    const grid = document.querySelector(".project-grid");
    if (grid) {
      grid.addEventListener("click", (e) => {
        if (e.target.closest(".project-card") && currentFilter) {
          // allow normal card behavior, optionally clear on background click only
        }
      });
    }
  }
})();
