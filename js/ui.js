/**
 * Gideon's Travel Guide - UI Controller & Interactions
 * Manages theme switching, interactive region drawers, preview cards, fullscreen, and notifications.
 */

class UIController {
  constructor() {
    this.theme = this.getInitialTheme();
    this.drawer = document.getElementById("regions-drawer");
    this.drawerBackdrop = document.getElementById("drawer-backdrop");
    this.previewCard = document.getElementById("region-preview-card");
    this.previewTimeout = null;

    this.initTheme();
    this.initDrawer();
    this.initPreviewCard();
    this.initMapControls();
    this.initStats();
    this.initFullscreen();
  }

  /* ==========================================================================
     Theme Management (Light / Dark)
     ========================================================================== */
  getInitialTheme() {
    const savedTheme = localStorage.getItem("travel_guide_theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    // Check OS preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "dark"; // Default to dark for a modern, sleek map appearance
  }

  initTheme() {
    this.applyTheme(this.theme);

    const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
    themeToggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextTheme = this.theme === "dark" ? "light" : "dark";
        this.setTheme(nextTheme);
      });
    });

    // Listen to OS theme changes if user hasn't explicitly set preference
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("travel_guide_theme")) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
    }
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem("travel_guide_theme", theme);
    this.applyTheme(theme);

    // Notify Map controller to re-render region/canvas colors if needed
    if (window.travelApp && typeof window.travelApp.onThemeChange === "function") {
      window.travelApp.onThemeChange(theme);
    }
  }

  applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    // Update meta theme-color for browser chrome
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "dark" ? "#0b0f19" : "#ffffff");
    }

    // Update aria labels on theme togglers
    const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
    themeToggleBtns.forEach((btn) => {
      btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
      btn.setAttribute("title", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    });
  }

  /* ==========================================================================
     Regions Explorer Drawer / Sidebar
     ========================================================================== */
  initDrawer() {
    const drawerOpenBtns = document.querySelectorAll(".drawer-open-btn");
    const drawerCloseBtns = document.querySelectorAll(".drawer-close-btn");

    drawerOpenBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.openDrawer());
    });

    drawerCloseBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.closeDrawer());
    });

    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener("click", () => this.closeDrawer());
    }

    this.renderDrawerContent();
  }

  openDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.add("is-open");
    if (this.drawerBackdrop) this.drawerBackdrop.classList.add("is-open");
    document.body.classList.add("drawer-open");
    this.drawer.setAttribute("aria-hidden", "false");
  }

  closeDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.remove("is-open");
    if (this.drawerBackdrop) this.drawerBackdrop.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    this.drawer.setAttribute("aria-hidden", "true");
  }

  renderDrawerContent() {
    const container = document.getElementById("drawer-regions-list");
    if (!container) return;

    let html = "";
    Object.entries(REGIONS_CONFIG).forEach(([regionName, regData]) => {
      const countriesList = regData.countries
        .map((code) => {
          const c = COUNTRY_LOOKUP[code] || { name: code, flag: "🌐" };
          return `<span class="country-pill" title="${c.name}">${c.flag} ${c.name}</span>`;
        })
        .join("");

      html += `
        <article class="drawer-region-card" style="--region-accent: ${regData.color};" data-region="${regionName}">
          <div class="card-header">
            <div class="card-title-group">
              <span class="region-emoji-badge">${regData.icon}</span>
              <div>
                <h3 class="region-card-title">${regionName}</h3>
                <span class="region-card-tagline">${regData.tagline}</span>
              </div>
            </div>
            <span class="country-count-badge">${regData.countries.length} destinations</span>
          </div>

          <p class="region-card-desc">${regData.description}</p>

          <div class="region-countries-wrap">
            ${countriesList}
          </div>

          <div class="region-card-footer">
            <button class="region-focus-btn" data-region="${regionName}" aria-label="Highlight ${regionName} on map">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="22" y1="12" x2="18" y2="12"></line>
                <line x1="6" y1="12" x2="2" y2="12"></line>
                <line x1="12" y1="6" x2="12" y2="2"></line>
                <line x1="12" y1="22" x2="12" y2="18"></line>
              </svg>
              <span>Highlight on Map</span>
            </button>
            <a href="${regData.link}" target="_blank" rel="noopener noreferrer" class="region-explore-link">
              <span>Open Guide</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;

    // Attach listeners to highlight on hover / click
    container.querySelectorAll(".drawer-region-card").forEach((card) => {
      const regName = card.dataset.region;

      card.addEventListener("mouseenter", () => {
        if (window.travelApp) window.travelApp.previewRegion(regName);
      });

      card.addEventListener("mouseleave", () => {
        if (window.travelApp) window.travelApp.clearPreview();
      });

      const focusBtn = card.querySelector(".region-focus-btn");
      if (focusBtn) {
        focusBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.closeDrawer();
          if (window.travelApp) {
            window.travelApp.highlightRegion(regName, true);
          }
          this.showRegionPreview(regName);
        });
      }
    });
  }

  /* ==========================================================================
     Floating Destination / Region Preview Card
     ========================================================================== */
  initPreviewCard() {
    if (!this.previewCard) return;

    const closeBtn = document.getElementById("preview-card-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hideRegionPreview());
    }

    const shareBtn = document.getElementById("preview-card-share");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const link = shareBtn.dataset.url;
        if (link) {
          navigator.clipboard.writeText(link).then(() => {
            this.showToast("Guide link copied to clipboard!");
          });
        }
      });
    }
  }

  showRegionPreview(regionName, specificCountryCode = null) {
    if (!this.previewCard) return;

    const regData = REGIONS_CONFIG[regionName];
    if (!regData) return;

    const titleElem = document.getElementById("preview-title");
    const subtitleElem = document.getElementById("preview-subtitle");
    const descElem = document.getElementById("preview-desc");
    const badgeElem = document.getElementById("preview-badge");
    const iconElem = document.getElementById("preview-icon");
    const linkElem = document.getElementById("preview-link");
    const shareBtn = document.getElementById("preview-card-share");
    const countriesWrap = document.getElementById("preview-countries-list");

    let activeTitle = regionName;
    let activeSub = regData.tagline;

    if (specificCountryCode) {
      const cDetails = getCountryDetails(specificCountryCode);
      if (cDetails) {
        activeTitle = `${cDetails.flag} ${cDetails.name}`;
        activeSub = `Part of the ${regionName} Guide`;
      }
    }

    if (titleElem) titleElem.textContent = activeTitle;
    if (subtitleElem) subtitleElem.textContent = activeSub;
    if (descElem) descElem.textContent = regData.description;
    if (badgeElem) {
      badgeElem.textContent = `${regData.countries.length} Destinations`;
      badgeElem.style.backgroundColor = `${regData.color}25`;
      badgeElem.style.color = regData.color;
      badgeElem.style.borderColor = `${regData.color}50`;
    }
    if (iconElem) iconElem.textContent = regData.icon;
    if (linkElem) {
      linkElem.href = regData.link;
      linkElem.style.backgroundColor = regData.color;
    }
    if (shareBtn) {
      shareBtn.dataset.url = regData.link;
    }

    if (countriesWrap) {
      countriesWrap.innerHTML = regData.countries
        .map((code) => {
          const c = COUNTRY_LOOKUP[code] || { name: code, flag: "🌐" };
          const isTarget = specificCountryCode && specificCountryCode.toUpperCase() === code;
          return `<span class="preview-country-chip ${isTarget ? "is-active" : ""}" title="${c.name}">${c.flag} ${c.name}</span>`;
        })
        .join("");
    }

    this.previewCard.style.setProperty("--card-accent", regData.color);
    this.previewCard.classList.add("is-visible");

    // Auto-focus action button for accessibility if requested
    clearTimeout(this.previewTimeout);
  }

  hideRegionPreview() {
    if (!this.previewCard) return;
    this.previewCard.classList.remove("is-visible");
  }

  /* ==========================================================================
     HUD / Map Controls
     ========================================================================== */
  initMapControls() {
    const zoomInBtn = document.getElementById("btn-zoom-in");
    const zoomOutBtn = document.getElementById("btn-zoom-out");
    const resetViewBtn = document.getElementById("btn-reset-view");

    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", () => {
        if (window.travelApp) window.travelApp.zoomIn();
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", () => {
        if (window.travelApp) window.travelApp.zoomOut();
      });
    }

    if (resetViewBtn) {
      resetViewBtn.addEventListener("click", () => {
        if (window.travelApp) window.travelApp.resetView();
        this.hideRegionPreview();
      });
    }
  }

  /* ==========================================================================
     Fullscreen API
     ========================================================================== */
  initFullscreen() {
    const fullscreenBtns = document.querySelectorAll(".fullscreen-toggle-btn");
    fullscreenBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.warn(`Error enabling fullscreen: ${err.message}`);
          });
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    });

    document.addEventListener("fullscreenchange", () => {
      const isFullscreen = Boolean(document.fullscreenElement);
      fullscreenBtns.forEach((btn) => {
        btn.classList.toggle("is-fullscreen", isFullscreen);
        btn.setAttribute("title", isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen");
      });
    });
  }

  /* ==========================================================================
     Stats Pill & Counter
     ========================================================================== */
  initStats() {
    const processed = getProcessedData();
    const regionCountElem = document.getElementById("stats-regions-count");
    const countryCountElem = document.getElementById("stats-countries-count");

    if (regionCountElem) this.animateCounter(regionCountElem, processed.totalRegions);
    if (countryCountElem) this.animateCounter(countryCountElem, processed.totalCountries);
  }

  animateCounter(element, target, duration = 1200) {
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, stepTime);
  }

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */
  showToast(message, duration = 3000) {
    let toast = document.getElementById("global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "global-toast";
      toast.className = "global-toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");

    setTimeout(() => {
      toast.classList.remove("is-visible");
    }, duration);
  }
}
