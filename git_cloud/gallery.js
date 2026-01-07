// Protect page (must come from dashboard)
const username = localStorage.getItem("github_username");
const token = localStorage.getItem("github_token");
const selectedRepo = localStorage.getItem("selected_repo");

if (!username || !token || !selectedRepo) {
  window.location.href = "page3.html";
}

// Back to dashboard
function goBack() {
  window.location.href = "page3.html";
}

// Image handling (placeholder)
const images = []; // later: fetched from GitHub API

const imageCount = document.getElementById("imageCount");
const emptyState = document.getElementById("emptyState");
const imageGrid = document.getElementById("imageGrid");

imageCount.textContent = `${images.length} images`;

if (images.length === 0) {
  emptyState.hidden = false;
  imageGrid.hidden = true;
} else {
  emptyState.hidden = true;
  imageGrid.hidden = false;
}
