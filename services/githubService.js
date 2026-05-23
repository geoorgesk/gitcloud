import { Octokit } from '@octokit/rest';
import Repository from '../models/Repository.js';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const MAX_REPO_SIZE_MB = parseInt(process.env.MAX_REPO_SIZE_MB) || 800;

// Get or create active repository
export const getActiveRepo = async () => {
  let repo = await Repository.findOne({ isActive: true });

  if (!repo) {
    repo = await Repository.create({
      repoName: 'gitcloud-storage-1',
      currentSize: 0,
      isActive: true,
    });
  }

  return repo;
};

// Create a new GitHub repository
export const createNewRepo = async (index) => {
  const repoName = `gitcloud-storage-${index}`;
  try {
    await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: true,
      description: `GitCloud storage repository ${index}`,
      auto_init: true,
    });

    const repo = await Repository.create({
      repoName,
      currentSize: 0,
      isActive: true,
    });

    return repo;
  } catch (error) {
    throw new Error(`Failed to create repo: ${error.message}`);
  }
};

// Rotate repository if full
export const rotateRepoIfNeeded = async (currentRepo, fileSizeMB) => {
  const projectedSize = currentRepo.currentSize + fileSizeMB;

  if (projectedSize >= MAX_REPO_SIZE_MB) {
    // Deactivate current repo
    await Repository.findByIdAndUpdate(currentRepo._id, { isActive: false });

    // Get count of repos and create next one
    const repoCount = await Repository.countDocuments();
    const newRepo = await createNewRepo(repoCount + 1);
    return newRepo;
  }

  return currentRepo;
};

// Upload image to GitHub
export const uploadToGitHub = async (fileBuffer, filename, mimeType) => {
  try {
    // Get active repo and rotate if needed
    let activeRepo = await getActiveRepo();
    const fileSizeMB = fileBuffer.length / (1024 * 1024);
    activeRepo = await rotateRepoIfNeeded(activeRepo, fileSizeMB);

    // Convert to base64
    const base64Content = fileBuffer.toString('base64');
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${filename.replace(/\s+/g, '_')}`;
    const filePath = `images/${safeFilename}`;

    // Upload to GitHub
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_USERNAME,
      repo: activeRepo.repoName,
      path: filePath,
      message: `Upload ${safeFilename}`,
      content: base64Content,
    });

    // Update repo size in DB
    await Repository.findByIdAndUpdate(activeRepo._id, {
      $inc: { currentSize: fileSizeMB },
    });

    // Build raw URL
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${activeRepo.repoName}/main/${filePath}`;

    return {
      url: rawUrl,
      sha: response.data.content.sha,
      repoName: activeRepo.repoName,
      filename: safeFilename,
    };
  } catch (error) {
    throw new Error(`GitHub upload failed: ${error.message}`);
  }
};

// Delete image from GitHub
export const deleteFromGitHub = async (repoName, filename, fileSha) => {
  try {
    await octokit.repos.deleteFile({
      owner: GITHUB_USERNAME,
      repo: repoName,
      path: `images/${filename}`,
      message: `Delete ${filename}`,
      sha: fileSha,
    });
  } catch (error) {
    throw new Error(`GitHub delete failed: ${error.message}`);
  }
};