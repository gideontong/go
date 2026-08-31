/**
 * Gideon's Travel Guide - Main Application & Vector Map Engine
 * Orchestrates jsVectorMap, handles click/hover events, map series, dynamic theming, and interactive region focus.
 */

class TravelMapApp {
  constructor() {
    this.mapInstance = null;
    this.processedData = getProcessedData();
    this.currentFocusedRegion = null;
    this.hoveredCountry = null;

    this.init();
  }

  init() {
    this.renderLegend();
    this.initMap();
    this.initResizeListener();
  }

  /**
   * Get dynamic theme palette depending on active light/dark theme
   */
  getThemePalette() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    return {
      bg: "transparent",
      unassignedFill: isDark ? "#1e293b" : "#e2e8f0",
      unassignedHover: isDark ? "#334155" : "#cbd5e1",
      stroke: isDark ? "#0f172a" : "#cbd5e1",
      strokeWidth: 0.6,
      assignedHoverOpacity: 0.85,
    };
  }

  /**
   * Initialize jsVectorMap with configured regions and custom interaction handlers
   */
  initMap() {
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;

    if (typeof jsVectorMap === "undefined") {
      console.error("jsVectorMap library is not loaded.");
      mapContainer.innerHTML = `
        <div class="map-fallback-msg">
          <h2>Map could not be loaded</h2>
          <p>Please check your network connection and reload the page.</p>
        </div>
      `;
      return;
    }

    const palette = this.getThemePalette();

    try {
      this.mapInstance = new jsVectorMap({
        selector: "#map-container",
        map: "world",
        backgroundColor: palette.bg,
        draggable: true,
        zoomButtons: false, // We provide sleek custom floating HUD zoom buttons
        zoomOnScroll: true,
        zoomOnScrollSpeed: 1,
        zoomMax: 12,
        zoomMin: 1,
        zoomAnimate: true,
        showTooltip: true,

        // Base styling for regions
        regionStyle: {
          initial: {
            fill: palette.unassignedFill,
            fillOpacity: 1,
            stroke: palette.stroke,
            strokeWidth: palette.strokeWidth,
          },
          hover: {
            fill: palette.unassignedHover,
            fillOpacity: 0.9,
            cursor: "pointer",
          },
          selected: {
            fillOpacity: 1,
          },
          selectedHover: {
            fillOpacity: 0.9,
          },
        },

        // Color mapping series
        series: {
          regions: [
            {
              attribute: "fill",
              scale: this.processedData.regionColors,
              values: this.processedData.countryToRegionMap,
            },
          ],
        },

        // Custom rich HTML tooltip
        onRegionTooltipShow: (event, tooltip, code) => {
          this.handleTooltipShow(event, tooltip, code);
        },

        // Click handler to open destination guide or preview
        onRegionClick: (event, code) => {
          this.handleCountryClick(event, code);
        },

        // Map loaded callback
        onLoaded: (map) => {
          this.onMapReady(map);
        },
      });
    } catch (err) {
      console.error("Error creating jsVectorMap instance:", err);
    }
  }

  /**
   * Enrich tooltips with Flag, Country Name, Region Tag, and Action Hint
   */
  handleTooltipShow(event, tooltip, code) {
    const upperCode = code.toUpperCase();
    const details = getCountryDetails(upperCode);

    if (details && details.hasGuide) {
      const regionData = details.region;
      tooltip.text(
        `
        <div class="custom-map-tooltip" style="--tooltip-accent: ${regionData.color}">
          <div class="tooltip-header">
            <span class="tooltip-flag">${details.flag}</span>
            <span class="tooltip-name">${details.name}</span>
          </div>
          <div class="tooltip-region">
            <span class="tooltip-dot" style="background-color: ${regionData.color}"></span>
            <span class="tooltip-region-text">${details.regionName}</span>
          </div>
          <div class="tooltip-action">
            <span>Explore Guide</span>
            <span class="tooltip-arrow">↗</span>
          </div>
        </div>
        `,
        true // Enable HTML rendering in jsVectorMap tooltip
      );
    } else {
      // Unassigned country
      const countryInfo = COUNTRY_LOOKUP[upperCode];
      const countryName = countryInfo ? countryInfo.name : tooltip.text();
      const flag = countryInfo ? countryInfo.flag : "🌐";

      tooltip.text(
        `
        <div class="custom-map-tooltip is-unassigned">
          <div class="tooltip-header">
            <span class="tooltip-flag">${flag}</span>
            <span class="tooltip-name">${countryName}</span>
          </div>
          <div class="tooltip-unassigned-tag">No guide published yet</div>
        </div>
        `,
        true
      );
    }
  }

  /**
   * Handle clicking on a country on the world map
   */
  handleCountryClick(event, code) {
    const upperCode = code.toUpperCase();
    const details = getCountryDetails(upperCode);

    if (details && details.hasGuide) {
      const targetUrl = details.region.link;

      // Show the preview card on desktop / mobile
      if (window.travelUI) {
        window.travelUI.showRegionPreview(details.regionName, upperCode);
      }

      // Open guide in a new tab
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  }

  /**
   * Highlight and focus a specific country
   */
  highlightCountry(code, shouldFocus = false) {
    const upperCode = code.toUpperCase();
    const details = getCountryDetails(upperCode);
    if (!details) return;

    if (shouldFocus && this.mapInstance && typeof this.mapInstance.setFocus === "function") {
      try {
        this.mapInstance.setFocus({
          region: upperCode,
          animate: true,
        });
      } catch (e) {
        console.log("Focus region:", upperCode);
      }
    }
  }

  /**
   * Highlight and focus all countries in a region
   */
  highlightRegion(regionName, shouldFocus = false) {
    const regData = REGIONS_CONFIG[regionName];
    if (!regData || !this.mapInstance) return;

    if (shouldFocus && typeof this.mapInstance.setFocus === "function") {
      try {
        this.mapInstance.setFocus({
          regions: regData.countries,
          animate: true,
        });
      } catch (e) {
        console.log("Focus regions:", regData.countries);
      }
    }

    // Active pill styling in bottom legend
    this.updateLegendActive(regionName);
  }

  /**
   * Soft hover preview of a region from sidebar or bottom legend
   */
  previewRegion(regionName) {
    const regData = REGIONS_CONFIG[regionName];
    if (!regData) return;

    this.updateLegendActive(regionName);
  }

  clearPreview() {
    this.updateLegendActive(null);
  }

  /**
   * Render interactive floating bottom-dock legend
   */
  renderLegend() {
    const legendContainer = document.getElementById("regions-legend-dock");
    if (!legendContainer) return;

    let html = "";
    Object.entries(REGIONS_CONFIG).forEach(([regionName, regData]) => {
      html += `
        <button class="legend-pill" 
                data-region="${regionName}" 
                style="--legend-color: ${regData.color};"
                aria-label="View ${regionName} (${regData.countries.length} destinations)">
          <span class="legend-dot" style="background-color: ${regData.color}"></span>
          <span class="legend-name">${regionName}</span>
          <span class="legend-count">${regData.countries.length}</span>
        </button>
      `;
    });

    legendContainer.innerHTML = html;

    // Attach interactions
    legendContainer.querySelectorAll(".legend-pill").forEach((pill) => {
      const regName = pill.dataset.region;

      pill.addEventListener("mouseenter", () => {
        this.previewRegion(regName);
      });

      pill.addEventListener("mouseleave", () => {
        this.clearPreview();
      });

      pill.addEventListener("click", () => {
        this.highlightRegion(regName, true);
        if (window.travelUI) {
          window.travelUI.showRegionPreview(regName);
        }
      });
    });
  }

  updateLegendActive(activeRegionName) {
    const pills = document.querySelectorAll(".legend-pill");
    pills.forEach((pill) => {
      if (!activeRegionName) {
        pill.classList.remove("is-active", "is-dimmed");
      } else if (pill.dataset.region === activeRegionName) {
        pill.classList.add("is-active");
        pill.classList.remove("is-dimmed");
      } else {
        pill.classList.remove("is-active");
        pill.classList.add("is-dimmed");
      }
    });
  }

  /**
   * Map Zoom & Reset Controls
   */
  zoomIn() {
    if (!this.mapInstance) return;
    if (typeof this.mapInstance.zoomIn === "function") {
      this.mapInstance.zoomIn();
    } else if (typeof this.mapInstance._setScale === "function") {
      const step = (this.mapInstance.params && this.mapInstance.params.zoomStep) || 1.4;
      this.mapInstance._setScale(
        this.mapInstance.scale * step,
        this.mapInstance._width / 2,
        this.mapInstance._height / 2,
        false,
        true
      );
    }
  }

  zoomOut() {
    if (!this.mapInstance) return;
    if (typeof this.mapInstance.zoomOut === "function") {
      this.mapInstance.zoomOut();
    } else if (typeof this.mapInstance._setScale === "function") {
      const step = (this.mapInstance.params && this.mapInstance.params.zoomStep) || 1.4;
      this.mapInstance._setScale(
        this.mapInstance.scale / step,
        this.mapInstance._width / 2,
        this.mapInstance._height / 2,
        false,
        true
      );
    }
  }

  resetView() {
    if (!this.mapInstance) return;
    if (typeof this.mapInstance.reset === "function") {
      this.mapInstance.reset();
    } else if (this.mapInstance._baseScale) {
      this.mapInstance.scale = this.mapInstance._baseScale;
      this.mapInstance.transX = this.mapInstance._baseTransX || 0;
      this.mapInstance.transY = this.mapInstance._baseTransY || 0;
      if (typeof this.mapInstance._applyTransform === "function") {
        this.mapInstance._applyTransform();
      }
    }
    this.updateLegendActive(null);
  }

  /**
   * Re-apply theme changes dynamically to SVG elements
   */
  onThemeChange(theme) {
    const palette = this.getThemePalette();
    if (!this.mapInstance) return;

    // Update map region styles dynamically
    if (this.mapInstance.params && this.mapInstance.params.regionStyle) {
      this.mapInstance.params.regionStyle.initial.fill = palette.unassignedFill;
      this.mapInstance.params.regionStyle.initial.stroke = palette.stroke;
    }

    if (this.mapInstance.regions) {
      Object.keys(this.mapInstance.regions).forEach((code) => {
        const regionName = this.processedData.countryToRegionMap[code];
        const elem = this.mapInstance.regions[code].element;
        if (elem && elem.shape && elem.shape.node) {
          if (!regionName) {
            elem.shape.node.setAttribute("fill", palette.unassignedFill);
          }
          elem.shape.node.setAttribute("stroke", palette.stroke);
        }
      });
    }

    if (typeof this.mapInstance.updateSize === "function") {
      this.mapInstance.updateSize();
    }
  }

  onMapReady(map) {
    document.body.classList.add("map-ready");
  }

  initResizeListener() {
    window.addEventListener("resize", () => {
      if (this.mapInstance && typeof this.mapInstance.updateSize === "function") {
        this.mapInstance.updateSize();
      }
    });
  }
}

// Global instances initialization
document.addEventListener("DOMContentLoaded", () => {
  window.travelUI = new UIController();
  window.travelApp = new TravelMapApp();
  window.travelSearch = new SearchController();
});
