/**
 * Gideon's Travel Guide - Search & Command Palette Controller
 * Provides lightning-fast country and region search with keyboard shortcuts.
 */

class SearchController {
  constructor() {
    this.modal = document.getElementById("search-modal");
    this.input = document.getElementById("search-input");
    this.resultsContainer = document.getElementById("search-results");
    this.searchTriggers = document.querySelectorAll(".search-trigger-btn");
    this.closeBtn = document.getElementById("search-modal-close");
    this.selectedIndex = -1;
    this.currentResults = [];

    this.init();
  }

  init() {
    if (!this.modal || !this.input) return;

    // Search Trigger buttons (in navbar and floating HUD)
    this.searchTriggers.forEach((btn) => {
      btn.addEventListener("click", () => this.open());
    });

    // Close button & backdrop click
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Input handler
    this.input.addEventListener("input", (e) => {
      this.handleSearch(e.target.value.trim());
    });

    // Keyboard navigation
    this.input.addEventListener("keydown", (e) => {
      this.handleKeydown(e);
    });

    // Global shortcut listener (⌘K, Ctrl+K, /)
    document.addEventListener("keydown", (e) => {
      // Check if user pressed Cmd+K or Ctrl+K or / (when not focused on an input)
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isSlash = e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA";

      if (isCmdK || isSlash) {
        e.preventDefault();
        this.toggle();
      }

      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal.classList.contains("is-open");
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.modal.classList.add("is-open");
    this.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    this.input.value = "";
    this.selectedIndex = -1;
    this.handleSearch("");
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.modal.classList.remove("is-open");
    this.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    this.selectedIndex = -1;
  }

  handleSearch(query) {
    const q = query.toLowerCase();
    const processed = getProcessedData();
    const results = [];

    // Search Regions first
    Object.entries(REGIONS_CONFIG).forEach(([regionName, regData]) => {
      if (
        !q ||
        regionName.toLowerCase().includes(q) ||
        regData.tagline.toLowerCase().includes(q) ||
        regData.description.toLowerCase().includes(q)
      ) {
        results.push({
          type: "region",
          id: regData.id,
          title: regionName,
          subtitle: `${regData.countries.length} destinations • ${regData.tagline}`,
          icon: regData.icon,
          color: regData.color,
          link: regData.link,
          regionName: regionName,
          countries: regData.countries,
        });
      }
    });

    // Search Countries
    processed.allCountriesList.forEach((item) => {
      if (
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.regionName.toLowerCase().includes(q)
      ) {
        results.push({
          type: "country",
          code: item.code,
          title: item.name,
          subtitle: `${item.regionName} Guide`,
          icon: item.flag,
          color: item.regionData.color,
          link: item.regionData.link,
          regionName: item.regionName,
          countries: [item.code],
        });
      }
    });

    this.currentResults = results;
    this.selectedIndex = results.length > 0 ? 0 : -1;
    this.renderResults(results, query);
  }

  renderResults(results, query) {
    if (!this.resultsContainer) return;

    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <div class="empty-icon">🔍</div>
          <p class="empty-title">No destinations found for "<strong>${this.escapeHtml(query)}</strong>"</p>
          <p class="empty-desc">Try searching for a country like "Japan", "France", or a region like "Europe".</p>
        </div>
      `;
      return;
    }

    let html = "";
    results.forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      const typeBadge =
        item.type === "region"
          ? `<span class="result-badge region-badge" style="--badge-color: ${item.color}">Region</span>`
          : `<span class="result-badge country-badge" style="--badge-color: ${item.color}">${item.code}</span>`;

      html += `
        <div class="search-result-item ${isSelected ? "is-selected" : ""}" 
             data-index="${index}" 
             role="button" 
             tabindex="0"
             aria-selected="${isSelected}">
          <div class="result-icon-box" style="background-color: ${item.color}20; color: ${item.color};">
            <span class="result-emoji">${item.icon}</span>
          </div>
          <div class="result-info">
            <div class="result-header">
              <span class="result-title">${this.highlightMatch(item.title, query)}</span>
              ${typeBadge}
            </div>
            <span class="result-subtitle">${item.subtitle}</span>
          </div>
          <div class="result-action">
            <span class="action-text">Explore</span>
            <svg class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      `;
    });

    this.resultsContainer.innerHTML = html;

    // Attach click listeners to result items
    const items = this.resultsContainer.querySelectorAll(".search-result-item");
    items.forEach((elem) => {
      elem.addEventListener("click", () => {
        const index = parseInt(elem.dataset.index, 10);
        this.selectResult(index);
      });
      elem.addEventListener("mouseenter", () => {
        this.selectedIndex = parseInt(elem.dataset.index, 10);
        this.updateSelectionClasses();
      });
    });
  }

  handleKeydown(e) {
    if (this.currentResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.currentResults.length;
      this.updateSelectionClasses();
      this.scrollSelectedIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.currentResults.length) % this.currentResults.length;
      this.updateSelectionClasses();
      this.scrollSelectedIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
        this.selectResult(this.selectedIndex);
      }
    }
  }

  updateSelectionClasses() {
    const items = this.resultsContainer.querySelectorAll(".search-result-item");
    items.forEach((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
  }

  scrollSelectedIntoView() {
    const selected = this.resultsContainer.querySelector(".search-result-item.is-selected");
    if (selected) {
      selected.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  selectResult(index) {
    const item = this.currentResults[index];
    if (!item) return;

    this.close();

    // Trigger map highlight / preview
    if (window.travelApp) {
      if (item.type === "country") {
        window.travelApp.highlightCountry(item.code, true);
      } else {
        window.travelApp.highlightRegion(item.regionName, true);
      }
    }

    // Open guide link in new tab if double clicked or action taken
    // Also display region card
    if (window.travelUI) {
      window.travelUI.showRegionPreview(item.regionName, item.code || null);
    }
  }

  highlightMatch(text, query) {
    if (!query) return this.escapeHtml(text);
    const regex = new RegExp(`(${this.escapeRegExp(query)})`, "gi");
    return this.escapeHtml(text).replace(regex, "<mark class='search-highlight'>$1</mark>");
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
