// Run immediately when page loads
const username = localStorage.getItem("github_username");

if (!username) {
  // Prevent skipping Step 1
  window.location.href = "index.html";
}

// Back button
function goBack() {
  window.location.href = "index.html";
}

// Finish setup → go to dashboard
function finishSetup() {
  const token = document.getElementById("token").value.trim();

  if (!token) {
    alert("Please enter your GitHub token");
    return;
  }

  // Save token locally
  localStorage.setItem("github_token", token);

  // Redirect to dashboard (page 3)
  window.location.href = "page3.html";
}
