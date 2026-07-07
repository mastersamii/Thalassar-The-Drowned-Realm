"use strict";

let allNPCs = [];

document.addEventListener("DOMContentLoaded", loadNPCs);

async function loadNPCs() {
  const grid = document.getElementById("npcGrid");
  if (!grid) return;

  try {
    const response = await fetch("data/npcs.json");
    allNPCs = await response.json();

    renderNPCs(allNPCs.filter((npc) => npc.unlocked));
    bindFilters();
  } catch (error) {
    grid.innerHTML = `
      <article class="card">
        <h3>NPCs could not load.</h3>
        <p>Check that data/npcs.json exists and is valid JSON.</p>
      </article>
    `;
  }
}

function renderNPCs(npcs) {
  const grid = document.getElementById("npcGrid");

  grid.innerHTML = npcs
    .map((npc) => {
      const tags = (npc.tags || [])
        .map((tag) => `<span class="badge teal">${tag}</span>`)
        .join("");

      return `
        <article class="npc-card card searchable" data-category="${npc.category}">
          <div class="npc-image-wrap">
            <img class="npc-image" src="${npc.image}" alt="${npc.name}" onerror="this.src='assets/images/placeholder-npc.webp'" />
          </div>

          <div class="npc-card-body">
            <p class="eyebrow">${npc.category}</p>
            <h3>${npc.name}</h3>
            <p><strong>${npc.race}</strong> · ${npc.role}</p>
            <p>${npc.summary}</p>

            <div class="tag-row">${tags}</div>

            <a class="btn secondary npc-link" href="npc-profile.html?id=${npc.id}">Open Profile</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function bindFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;

      if (filter === "all") {
        renderNPCs(allNPCs.filter((npc) => npc.unlocked));
        return;
      }

      renderNPCs(
        allNPCs.filter((npc) => npc.unlocked && npc.category === filter)
      );
    });
  });
}
