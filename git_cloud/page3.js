// Protect page (must complete setup)
const username = localStorage.getItem("github_username");
const token = localStorage.getItem("github_token");

if (!username || !token) {
  window.location.href = "index.html";
}

// Show username
document.getElementById("username").textContent = "@" + username;

// Buttons (temporary actions)
document.querySelector(".capture").addEventListener("click", () => {
  alert("Camera capture will be implemented here");
});

document.querySelector(".gallery").addEventListener("click", () => {
  alert("Gallery view will be implemented here");
});
