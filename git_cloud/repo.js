// Protect page
const username = localStorage.getItem("github_username");
const token = localStorage.getItem("github_token");

if (!username || !token) {
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "page3.html";
}

// Repo selection (placeholder logic)
document.querySelectorAll(".repo-card").forEach(card => {
  card.addEventListener("click", () => {
    const repoName = card.querySelector("h2").textContent;
    localStorage.setItem("selected_repo", repoName);
    window.location.href = "page3.html";
  });
});
