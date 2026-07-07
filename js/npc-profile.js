"use strict";

document.addEventListener("DOMContentLoaded", loadNPCProfile);

async function loadNPCProfile() {
  const container = document.getElementById("npcProfile");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const response = await fetch("data/npcs.json");
    const npcs = await response.json();
    const npc = npcs.find((entry) => entry.id === id);

    if (!npc || !npc.unlocked) {
      container.innerHTML = `
        <section class="card">
          <h2>NPC Not Found</h2>
          <p>This NPC is either locked or does not exist yet.</p>
          <a class="btn secondary" href="npcs.html">Back to NPC Codex</a>
        </section>
      `;
      return;
    }

    document.title = `${npc.name} | Thalassar`;

    const tags = (npc.tags || [])
      .map((tag) => `<span class="badge teal">${tag}</span>`)
      .join("");

    const knownInfo = (npc.knownInfo || [])
      .map((info) => `<li>${info}</li>`)
      .join("");

    const appearances = (npc.appearances || [])
      .map((appearance) => `<span class="badge">${appearance}</span>`)
      .join("");

    const songs = (npc.songs || [])
      .map((song) => `
        <div class="music-card">
          <p><strong>${song.title}</strong></p>
          <audio controls src="${song.file}"></audio>
        </div>
      `)
      .join("");

    const gallery = (npc.gallery || [])
      .map((image) => `
        <img class="profile-gallery-image" src="${image}" alt="${npc.name} artwork" />
      `)
      .join("");

    container.innerHTML = `
      <section class="npc-profile-hero searchable">
        <div class="npc-profile-image-wrap">
          <img class="npc-profile-image" src="${npc.image}" alt="${npc.name}" onerror="this.src='assets/images/placeholder-npc.webp'" />
        </div>

        <div>
          <p class="eyebrow">${npc.category}</p>
          <h1>${npc.name}</h1>
          <p class="tagline">${npc.summary}</p>
          <div class="tag-row">${tags}</div>
          <a class="btn secondary" href="npcs.html">Back to NPC Codex</a>
        </div>
      </section>

      <section class="grid two searchable">
        <article class="card">
          <h2>Known Details</h2>
          <p><strong>Race:</strong> ${npc.race}</p>
          <p><strong>Role:</strong> ${npc.role}</p>
          <p><strong>First Appearance:</strong> ${npc.firstAppearance}</p>
          <p><strong>Location:</strong> ${npc.location}</p>
          <p><strong>Status:</strong> ${npc.status}</p>
        </article>

        <article class="card">
          <h2>Quote</h2>
          <p class="quote">“${npc.quote || "No quote recorded yet."}”</p>
        </article>
      </section>

      <section class="searchable">
        <h2>Player-Known Information</h2>
        <ul class="info-list">${knownInfo || "<li>No notes added yet.</li>"}</ul>
      </section>

      <section class="searchable">
        <h2>Session Appearances</h2>
        <div>${appearances || "<p>No appearances logged yet.</p>"}</div>
      </section>

      <section class="searchable">
        <h2>Attached Songs</h2>
        <div class="music-list">${songs || "<p>No songs attached yet.</p>"}</div>
      </section>

      <section class="searchable">
        <h2>Gallery</h2>
        <div class="profile-gallery">${gallery || "<p>No gallery images added yet.</p>"}</div>
      </section>
    `;
  } catch (error) {
    container.innerHTML = `
      <section class="card">
        <h2>NPC profile could not load.</h2>
        <p>Check that data/npcs.json is valid.</p>
      </section>
    `;
  }
}
