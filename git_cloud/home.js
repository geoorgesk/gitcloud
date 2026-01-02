
const continueBtn = document.getElementById("continueBtn");
const usernameInput = document.getElementById("username");

continueBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();

  if (!username) {
    alert("Please enter your GitHub username");
    return;
  }

  // Save username for next page
  localStorage.setItem("github_username", username);

  // Go to page 2
  window.location.href = "page2.html";
});
