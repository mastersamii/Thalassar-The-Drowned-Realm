"use strict";

document.addEventListener("DOMContentLoaded", loadAtlas);

async function loadAtlas() {
  const grid = document.getElementById("mapsGrid");
  if (!grid) return;

  try {
    const response = await fetch("data/maps.json");
    const maps = await response.json();
    const unlocked = maps.filter((map) => map.unlocked);

    grid.innerHTML = unlocked.map(renderMapCard).join("");
    bindMapDetails();
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
  const tags = (map.tags || [])
    .map((tag) => `<span class="badge teal">${tag}</span>`)
    .join("");

  const areas = (map.areas || [])
    .map((area) => `
      <article class="area-card searchable">
        <div class="area-number">${area.number}</div>
        <div>
          <h4>${area.name}</h4>
          <p>${area.description}</p>
          ${area.shops?.length ? `<p><strong>Shops:</strong> ${area.shops.join(", ")}</p>` : ""}
          ${area.npcs?.length ? `<p><strong>NPCs:</strong> ${area.npcs.join(", ")}</p>` : ""}
          ${area.sessions?.length ? `<p><strong>Sessions:</strong> ${area.sessions.join(", ")}</p>` : ""}
        </div>
      </article>
    `)
    .join("");

  return `
    <article class="card atlas-card searchable">
      <div class="atlas-card-header">
        <div>
          <p class="eyebrow">${map.type}</p>
          <h3>${map.name}</h3>
        </div>
        <span class="badge">${map.unlockedAt}</span>
      </div>

      <p>${map.description}</p>
      <div class="tag-row">${tags}</div>

      <button class="btn secondary atlas-toggle" type="button">Open Map Entry</button>

      <div class="atlas-details">
        <div class="atlas-image-wrap">
          <img class="atlas-image" src="${map.image}" alt="${map.name}" onerror="this.src='assets/maps/placeholder-map.webp'" />
        </div>
        <h3>Area Legend</h3>
        <div class="area-list">${areas}</div>
      </div>
    </article>
  `;
}

function bindMapDetails() {
  document.querySelectorAll(".atlas-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".atlas-card");
      card.classList.toggle("open");
      button.textContent = card.classList.contains("open") ? "Close Map Entry" : "Open Map Entry";
    });
  });
}
