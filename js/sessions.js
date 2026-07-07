"use strict";

document.addEventListener("DOMContentLoaded", loadSessions);

async function loadSessions() {
  const container = document.getElementById("sessionsGrid");
  if (!container) return;

  try {
    const response = await fetch("data/sessions.json");
    const sessions = await response.json();

    const unlockedSessions = sessions.filter((session) => session.unlocked);

    container.innerHTML = unlockedSessions
      .map((session) => renderSessionCard(session))
      .join("");

    bindSessionToggles();
  } catch (error) {
    container.innerHTML = `
      <article class="card">
        <h3>Sessions could not load.</h3>
        <p>Check that data/sessions.json exists and is valid JSON.</p>
      </article>
    `;
  }
}

function renderSessionCard(session) {
  const scenes = (session.majorScenes || [])
    .map((scene) => `<li>${scene}</li>`)
    .join("");

  const npcs = (session.npcsMet || [])
    .map((npc) => `<span class="badge teal">${npc}</span>`)
    .join("");

  const locations = (session.locationsVisited || [])
    .map((location) => `<span class="badge">${location}</span>`)
    .join("");

  const clues = (session.unresolvedQuestions || [])
    .map((clue) => `<li>${clue}</li>`)
    .join("");

  return `
    <article class="card session-card searchable">
      <div class="session-header">
        <div>
          <p class="eyebrow">Session ${session.number}</p>
          <h3>${session.title}</h3>
        </div>
        <span class="badge coral">Level ${session.level}</span>
      </div>

      <p>${session.summary}</p>

      <button class="btn secondary session-toggle" type="button">
        View Details
      </button>

      <div class="session-details">
        <h4>Major Scenes</h4>
        <ul>${scenes}</ul>

        <h4>NPCs Met</h4>
        <div>${npcs || "<p>No NPCs listed yet.</p>"}</div>

        <h4>Locations Visited</h4>
        <div>${locations || "<p>No locations listed yet.</p>"}</div>

        <h4>Unresolved Questions</h4>
        <ul>${clues || "<li>No unresolved questions listed yet.</li>"}</ul>
      </div>
    </article>
  `;
}

function bindSessionToggles() {
  const buttons = document.querySelectorAll(".session-toggle");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".session-card");
      card.classList.toggle("open");

      button.textContent = card.classList.contains("open")
        ? "Hide Details"
        : "View Details";
    });
  });
}
