// Protect page
const username = localStorage.getItem("github_username");
const token = localStorage.getItem("github_token");

if (!username || !token) {
  window.location.href = "index.html";
}

// Show username
document.getElementById("username").textContent = "@" + username;

// Show selected repository
const selectedRepo = localStorage.getItem("selected_repo");
const repoText = document.getElementById("selectedRepoText");

if (selectedRepo && repoText) {
  repoText.textContent = selectedRepo;
}

// Navigation
function openRepos() {
  window.location.href = "repo.html";
}


function openGallery() {
  const selectedRepo = localStorage.getItem("selected_repo");

  if (!selectedRepo) {
    alert("Please select a repository first");
    return;
  }

  window.location.href = "gallery.html";
}

// Buttons (temporary)
document.querySelector(".capture").addEventListener("click", () => {
  alert("Camera capture will be implemented here");
});





