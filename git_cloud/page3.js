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



const captureBtn = document.querySelector(".capture");
const modal = document.getElementById("captureModal");
const cameraInput = document.getElementById("cameraInput");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.querySelector(".modal-upload");

let selectedFiles = [];

// Open modal
captureBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Close modal
function closeModal() {
  modal.style.display = "none";
  selectedFiles = [];
  uploadBtn.disabled = true;
  uploadBtn.classList.remove("enabled");
}

// Camera
function openCamera() {
  cameraInput.click();
}

// File upload
function openFileUpload() {
  fileInput.click();
}

// Handle selections
cameraInput.addEventListener("change", handleFiles);
fileInput.addEventListener("change", handleFiles);

function handleFiles(e) {
  selectedFiles = Array.from(e.target.files);

  if (selectedFiles.length > 0) {
    uploadBtn.disabled = false;
    uploadBtn.classList.add("enabled");
  }
}

// Upload action (placeholder)
function uploadImages() {
  if (selectedFiles.length === 0) return;

  alert(`${selectedFiles.length} image(s) ready to upload`);
  console.log("Selected files:", selectedFiles);

  closeModal();

  /*
    NEXT STEP:
    - Send files to backend
    - Upload to GitHub repo
  */
}




