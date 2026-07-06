/* ==========================================================
   THALASSAR CAMPAIGN COMPANION
   Global JavaScript
========================================================== */

"use strict";

/* ==========================================================
   DOM Ready
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    initializeNavigation();

    initializeBackToTop();

    initializeSearch();

    initializeScrollAnimations();

    initializeQuotes();

    initializeCurrentYear();

});


/* ==========================================================
   Theme
========================================================== */

function initializeTheme(){

    const saved = localStorage.getItem("thalassar-theme");

    if(saved){

        document.documentElement.setAttribute("data-theme", saved);

    }

}

function toggleTheme(){

    const html = document.documentElement;

    const current = html.getAttribute("data-theme");

    const next = current === "dark"
        ? "light"
        : "dark";

    html.setAttribute("data-theme", next);

    localStorage.setItem("thalassar-theme", next);

}


/* ==========================================================
   Mobile Navigation
========================================================== */

function initializeNavigation(){

    const menuButton = document.querySelector(".menu-btn");

    const links = document.querySelector(".nav-links");

    if(!menuButton || !links) return;

    menuButton.addEventListener("click", () => {

        links.classList.toggle("open");

    });

}


/* ==========================================================
   Back To Top
========================================================== */

function initializeBackToTop(){

    const button = document.getElementById("topBtn");

    if(!button) return;

    window.addEventListener("scroll", () => {

        if(window.scrollY > 500){

            button.style.display = "block";

        }

        else{

            button.style.display = "none";

        }

    });

}

function scrollToTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/* ==========================================================
   Search
========================================================== */

function initializeSearch(){

    const search = document.getElementById("searchInput");

    if(!search) return;

    search.addEventListener("keyup", performSearch);

}

function performSearch(){

    const query = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const searchable = document.querySelectorAll(".searchable");

    searchable.forEach(section=>{

        const text = section.innerText.toLowerCase();

        if(query === ""){

            section.style.display="block";

        }

        else if(text.includes(query)){

            section.style.display="block";

        }

        else{

            section.style.display="none";

        }

    });

}


/* ==========================================================
   Fade In Animation
========================================================== */

function initializeScrollAnimations(){

    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("visible");

            }

        });

    },{

        threshold:.15

    });

    sections.forEach(section=>{

        observer.observe(section);

    });

}


/* ==========================================================
   Random Quote
========================================================== */

async function initializeQuotes(){

    const quoteContainer = document.getElementById("dailyQuote");

    if(!quoteContainer) return;

    try{

        const response = await fetch("data/quotes.json");

        const quotes = await response.json();

        const random = quotes[Math.floor(Math.random()*quotes.length)];

        quoteContainer.innerHTML =

        `
        <p>"${random.quote}"</p>
        <small>${random.author}</small>
        `;

    }

    catch(error){

        console.log(error);

    }

}


/* ==========================================================
   Current Year
========================================================== */

function initializeCurrentYear(){

    const year = document.getElementById("year");

    if(!year) return;

    year.innerText = new Date().getFullYear();

}


/* ==========================================================
   Smooth Anchor Links
========================================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


/* ==========================================================
   Placeholder Notification
========================================================== */

function showComingSoon(feature){

    alert(feature + " is coming soon!");

}
