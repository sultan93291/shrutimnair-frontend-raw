const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");
const redirectBtn = document.querySelector(".redirect");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  overlay.classList.toggle("opacity-0");
  overlay.classList.toggle("pointer-events-none");
  document.body.classList.toggle("overflow-hidden");
});

overlay.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("opacity-0", "pointer-events-none");
  document.body.classList.remove("overflow-hidden");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("opacity-0", "pointer-events-none");
  document.body.classList.remove("overflow-hidden");
});

redirectBtn.addEventListener("click", () => {
  window.location.href = "../select-option.html";
})
