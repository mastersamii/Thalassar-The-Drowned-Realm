"use strict";

let unlockedMaps = [];

document.addEventListener("DOMContentLoaded", loadMaps);

async function loadMaps() {
  const grid = document.getElementById("mapsGrid");
  if (!grid) return;

  try {
    const response = await fetch("data/maps.json");
    const maps = await response.json();
    unlockedMaps = maps.filter((map) => map.unlocked);

    grid.innerHTML = unlockedMaps.map(renderMapCard).join("");
    bindMapButtons();
    bindModal();
  } catch (error) {
    grid.innerHTML = `
      <article class="card">
        <h3>Maps could not load.</h3>
        <p>Check that data/maps.json exists and is valid JSON.</p>
      </article>
    `;
  }
}

function renderMapCard(map) {
  const pins = (map.pins || [])
    .map((pin) => `
      <button
        class="map-pin"
        style="top:${pin.top}; left:${pin.left};"
        data-title="${pin.title}"
        data-description="${pin.description}"
        data-type="${pin.type || "Location"}"
      >
        ${pin.number || "•"}
      </button>
    `)
    .join("");

  const tags = (map.tags || [])
    .map((tag) => `<span class="badge teal">${tag}</span>`)
    .join("");

  return `
    <article class="card map-card searchable">
      <div class="map-card-header">
        <div>
          <p class="eyebrow">${map.type}</p>
          <h3>${map.name}</h3>
        </div>
        <span class="badge">${map.unlockedAt}</span>
      </div>

      <p>${map.description}</p>
      <div class="tag-row">${tags}</div>

      <div class="interactive-map-wrap">
        <img class="interactive-map-image" src="${map.image}" alt="${map.name}" onerror="this.src='assets/maps/placeholder-map.webp'" />
        ${pins}
      </div>

      <button class="btn secondary open-map-btn" data-map-id="${map.id}">
        Open Large Map
      </button>
    </article>
  `;
}

function bindMapButtons() {
  document.querySelectorAll(".map-pin").forEach((pin) => {
    pin.addEventListener("click", () => {
      alert(`${pin.dataset.title}\n${pin.dataset.type}\n\n${pin.dataset.description}`);
    });
  });

  document.querySelectorAll(".open-map-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const map = unlockedMaps.find((entry) => entry.id === button.dataset.mapId);
      openMapModal(map);
    });
  });
}

function bindModal() {
  const modal = document.getElementById("mapModal");
  const close = document.getElementById("closeMapModal");
  if (!modal || !close) return;

  close.addEventListener("click", closeMapModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeMapModal();
  });
}

function openMapModal(map) {
  const modal = document.getElementById("mapModal");
  const content = document.getElementById("mapModalContent");
  if (!modal || !content || !map) return;

  const pins = (map.pins || [])
    .map((pin) => `
      <button
        class="map-pin"
        style="top:${pin.top}; left:${pin.left};"
        data-title="${pin.title}"
        data-description="${pin.description}"
        data-type="${pin.type || "Location"}"
      >
        ${pin.number || "•"}
      </button>
    `)
    .join("");

  content.innerHTML = `
    <h2>${map.name}</h2>
    <p>${map.description}</p>
    <div class="interactive-map-wrap large">
      <img class="interactive-map-image" src="${map.image}" alt="${map.name}" />
      ${pins}
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  content.querySelectorAll(".map-pin").forEach((pin) => {
    pin.addEventListener("click", () => {
      alert(`${pin.dataset.title}\n${pin.dataset.type}\n\n${pin.dataset.description}`);
    });
  });
}

function closeMapModal() {
  const modal = document.getElementById("mapModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
