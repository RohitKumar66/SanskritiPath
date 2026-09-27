// Bharat Heritage Explorer — data loading, rendering, filters, and interactions

const categoryNames = [
  "Festivals",
  "Art & Craft",
  "Food & Cuisine",
  "Dance & Music",
  "Traditional Clothing",
  "Languages & Literature",
  "Folk Traditions",
  "Architecture",
  "Rituals & Customs",
  "Handicrafts"
];

const heritageTypes = [
  // "Monument",
  "Historic Site",
  "Temple",
  "Fort",
  "Cultural Landscape",
  "Other"
];

let appData = {
  heroSlides: [],
  states: [],
  culture: [],
  heritagePlaces: []
};

let selectedCultureCategory = "All";
let heroSlideIndex = 0;
let heroSlideInterval = null;

const elements = {
  stateGrid: document.getElementById("stateGrid"),
  cultureCategoryGrid: document.getElementById("cultureCategoryGrid"),
  featuredGrid: document.getElementById("featuredGrid"),
  gemsGrid: document.getElementById("gemsGrid"),
  exploreGrid: document.getElementById("exploreGrid"),
  cultureGrid: document.getElementById("cultureGrid"),
  heritageGrid: document.getElementById("heritageGrid"),
  searchInput: document.getElementById("searchInput"),
  stateFilter: document.getElementById("stateFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  heritageStateFilter: document.getElementById("heritageStateFilter"),
  typeFilter: document.getElementById("typeFilter"),
  exploreCount: document.getElementById("exploreCount"),
  cultureTabs: document.getElementById("cultureTabs"),
  detailModal: document.getElementById("detailModal"),
  modalImage: document.getElementById("modalImage"),
  modalTitle: document.getElementById("modalTitle"),
  modalState: document.getElementById("modalState"),
  modalCategory: document.getElementById("modalCategory"),
  modalDescription: document.getElementById("modalDescription"),
  modalSignificance: document.getElementById("modalSignificance"),
  modalFacts: document.getElementById("modalFacts"),
  toast: document.getElementById("toast")
};

/**
 * Prefer the inline data.js bundle so the page still works if fetch()
 * is blocked (for example when opening the HTML file directly).
 */
async function loadData() {
  let loadedData = null;

  try {
    if (typeof window !== "undefined" && window.APP_DATA) {
      loadedData = window.APP_DATA;
    }

    if (!loadedData && typeof fetch === "function") {
      const response = await fetch("data.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Could not load data");
      }
      loadedData = await response.json();
    }

    if (!loadedData) {
      throw new Error("No site data available");
    }

    appData = loadedData;
    initialisePage();
  } catch (error) {
    if (typeof document !== "undefined") {
      showToast("Unable to load site content. Please refresh or open via a local server.");
    }
    console.error(error);
  }
}

function initialisePage() {
  renderHeroSlideshow();
  renderStates();
  renderCultureCategories();
  renderHomeCards();
  populateFilters();
  renderExploreResults();
  renderCulture();
  renderHeritagePlaces();
}

function renderHeroSlideshow() {
  if (!appData.heroSlides || appData.heroSlides.length === 0) {
    return;
  }

  const slideshow = document.getElementById("heroSlideshow");
  if (!slideshow) {
    return;
  }

  slideshow.innerHTML = appData.heroSlides
    .map((slide, index) => {
      const activeClass = index === 0 ? " active" : "";
      return (
        `<img src="${slide.image}" alt="${slide.alt}" ` +
        `class="hero-slide${activeClass}" onerror="handleImageError(this)">`
      );
    })
    .join("");

  if (appData.heroSlides.length > 1) {
    heroSlideIndex = 0;
    if (heroSlideInterval) {
      clearInterval(heroSlideInterval);
    }

    heroSlideInterval = setInterval(() => {
      const slides = [...document.querySelectorAll(".hero-slide")];
      if (!slides.length) {
        return;
      }

      slides[heroSlideIndex].classList.remove("active");
      heroSlideIndex = (heroSlideIndex + 1) % slides.length;
      slides[heroSlideIndex].classList.add("active");
    }, 4500);
  }
}

function renderStates() {
  elements.stateGrid.innerHTML = appData.states
    .map((state) => `
      <article class="state-card">
        <img src="${state.image}" alt="${state.name}" onerror="handleImageError(this)">
        <div class="state-card-body">
          <h3>${state.name}</h3>
          <p>${state.shortDescription}</p>
          <a class="card-link" href="#explore" data-state="${state.name}">Explore →</a>
        </div>
      </article>
    `)
    .join("");

  elements.stateGrid.querySelectorAll("[data-state]").forEach((link) => {
    link.addEventListener("click", () => {
      elements.stateFilter.value = link.dataset.state;
      renderExploreResults();
    });
  });
}

function renderCultureCategories() {
  const icons = ["✦", "◇", "◌", "♫", "▧", "≡", "⚘", "⌂", "⊙", "◈"];
  const descriptions = "Explore India's rich cultural heritage.";

  elements.cultureCategoryGrid.innerHTML = categoryNames
    .map((category, index) => `
      <a class="category-card" href="#culture" data-category="${category}">
        <span class="category-icon" aria-hidden="true">${icons[index]}</span>
        <h3>${category}</h3>
        <p>${descriptions}</p>
      </a>
    `)
    .join("");

  elements.cultureCategoryGrid.querySelectorAll("[data-category]").forEach((card) => {
    card.addEventListener("click", () => {
      selectCultureCategory(card.dataset.category);
    });
  });
}

function imageMarkup(item) {
  const imageUrl = item.image ||
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80";

  return `
    <div class="heritage-card-image">
      <img src="${imageUrl}" alt="${item.title}" onerror="handleImageError(this)">
    </div>
  `;
}

function renderHomeCards() {
  elements.featuredGrid.innerHTML = appData.heritagePlaces
    .slice(7, 56)
    .filter((_, i) => i % 15 === 0)
    // filter((_, index) => index % 5 === 0)
    .map((item) => createCard(item, "place"))
    .join("");

  elements.gemsGrid.innerHTML = appData.culture
    .filter((item) => item.lesserKnown)
    .slice(5, 10)
    .filter((_, i) => i % 2 === 0) // skip 1 in between
    .map((item) => createCard(item, "culture", true))
    .join("");

  bindCardButtons(document);
}

function createCard(item, kind = "culture", isGem = false) {
  const category = kind === "place" ? item.type : item.category;
  const details = encodeURIComponent(JSON.stringify({ ...item, kind }));
  const gemLabel = isGem ? '<span class="gem-label">Hidden gem</span>' : "";

  return `
    <article class="heritage-card">
      ${imageMarkup(item)}
      <div class="heritage-card-body">
        ${gemLabel}
        <div class="card-meta">
          <span>${item.state}</span>
          <span>${category}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.shortDescription}</p>
        <button class="card-link detail-button" type="button" data-item="${details}">
          View details →
        </button>
      </div>
    </article>
  `;
}

function bindCardButtons(scope) {
  scope.querySelectorAll(".detail-button").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(JSON.parse(decodeURIComponent(button.dataset.item)));
    });
  });
}

function populateFilters() {
  const stateOptions = appData.states
    .map((state) => `<option value="${state.name}">${state.name}</option>`)
    .join("");

  elements.stateFilter.insertAdjacentHTML("beforeend", stateOptions);
  elements.heritageStateFilter.insertAdjacentHTML("beforeend", stateOptions);

  const categoryOptions = categoryNames
    .concat("Heritage Place")
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
  elements.categoryFilter.insertAdjacentHTML("beforeend", categoryOptions);

  const typeOptions = heritageTypes
    .map((type) => `<option value="${type}">${type}</option>`)
    .join("");
  elements.typeFilter.insertAdjacentHTML("beforeend", typeOptions);

  categoryNames.forEach((category) => {
    elements.cultureTabs.insertAdjacentHTML(
      "beforeend",
      `<button class="tab-button" type="button" role="tab" data-category="${category}">${category}</button>`
    );
  });

  elements.cultureTabs.insertAdjacentHTML(
    "afterbegin",
    '<button class="tab-button active" type="button" role="tab" data-category="All">All</button>'
  );

  elements.cultureTabs.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectCultureCategory(button.dataset.category);
    });
  });
}

function getAllExploreItems() {
  const cultureItems = appData.culture.map((item) => ({
    ...item,
    kind: "culture"
  }));

  const placeItems = appData.heritagePlaces.map((item) => ({
    ...item,
    category: "Heritage Place",
    kind: "place"
  }));

  return [...cultureItems, ...placeItems];
}

function renderExploreResults() {
  const searchTerm = elements.searchInput.value.trim().toLowerCase();
  const state = elements.stateFilter.value;
  const category = elements.categoryFilter.value;

  const results = getAllExploreItems().filter((item) => {
    const searchableText = `${item.title} ${item.state} ${item.category} ${item.shortDescription}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm);
    const matchesState = state === "All States" || item.state === state;
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesState && matchesCategory;
  });

  elements.exploreGrid.innerHTML = results.length
    ? results.map((item) => createCard(item, item.kind)).join("")
    : '<p class="empty-state">No stories match these filters yet.</p>';

  elements.exploreCount.textContent = `${results.length} ${results.length === 1 ? "result" : "results"}`;
  bindCardButtons(elements.exploreGrid);
}

function selectCultureCategory(category) {
  selectedCultureCategory = category;
  elements.cultureTabs.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === category);
  });
  renderCulture();
}

function renderCulture() {
  const results = selectedCultureCategory === "All"
    ? appData.culture
    : appData.culture.filter((item) => item.category === selectedCultureCategory);

  elements.cultureGrid.innerHTML = results.length
    ? results.map((item) => createCard(item, "culture")).join("")
    : '<p class="empty-state">No culture entries are available for this category yet.</p>';

  bindCardButtons(elements.cultureGrid);
}

function renderHeritagePlaces() {
  const state = elements.heritageStateFilter.value;
  const type = elements.typeFilter.value;

  const results = appData.heritagePlaces.filter((item) => {
    const matchesState = state === "All States" || item.state === state;
    const matchesType = type === "All" || item.type === type;
    return matchesState && matchesType;
  });

  elements.heritageGrid.innerHTML = results.length
    ? results.map((item) => createCard(item, "place")).join("")
    : '<p class="empty-state">No heritage places match these filters yet.</p>';

  bindCardButtons(elements.heritageGrid);
}

function openModal(item) {
  elements.modalImage.src = item.image;
  elements.modalImage.alt = item.title;
  elements.modalTitle.textContent = item.title;
  elements.modalState.textContent = item.state;
  elements.modalCategory.textContent = item.category || item.type;
  elements.modalDescription.textContent = item.description || item.shortDescription;
  elements.modalSignificance.textContent = item.significance ||
    "Placeholder cultural significance. Add sourced information before presenting this as factual.";
  elements.modalFacts.textContent = item.facts || "Placeholder fact 01 · Placeholder fact 02";
  elements.detailModal.classList.add("open");
  elements.detailModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function closeModal() {
  elements.detailModal.classList.remove("open");
  elements.detailModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function randomDiscovery() {
  const item = appData.culture[Math.floor(Math.random() * appData.culture.length)];
  openModal({ ...item, kind: "culture" });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 3500);
}

// Event bindings

document.getElementById("searchInput").addEventListener("input", renderExploreResults);
document.getElementById("stateFilter").addEventListener("change", renderExploreResults);
document.getElementById("categoryFilter").addEventListener("change", renderExploreResults);
document.getElementById("heritageStateFilter").addEventListener("change", renderHeritagePlaces);
document.getElementById("typeFilter").addEventListener("change", renderHeritagePlaces);

document.getElementById("clearFilters").addEventListener("click", () => {
  elements.searchInput.value = "";
  elements.stateFilter.value = "All States";
  elements.categoryFilter.value = "All";
  renderExploreResults();
});

document.getElementById("clearHeritageFilters").addEventListener("click", () => {
  elements.heritageStateFilter.value = "All States";
  elements.typeFilter.value = "All";
  renderHeritagePlaces();
});

document.getElementById("surpriseButton").addEventListener("click", randomDiscovery);
document.getElementById("modalClose").addEventListener("click", closeModal);

elements.detailModal.addEventListener("click", (event) => {
  if (event.target === elements.detailModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.detailModal.classList.contains("open")) {
    closeModal();
  }
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
  });
});

document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("mainNav");
  const isOpen = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});

loadData();
