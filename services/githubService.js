import { Octokit } from '@octokit/rest';
import Repository from '../models/Repository.js';

const getOctokit = () => new Octokit({ auth: process.env.GITHUB_TOKEN });
const getUsername = () => process.env.GITHUB_USERNAME;
const getMaxSize = () => parseInt(process.env.MAX_REPO_SIZE_MB) || 800;

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

export const createNewRepo = async (index) => {
  const repoName = `gitcloud-storage-${index}`;
  try {
    await getOctokit().repos.createForAuthenticatedUser({
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

export const rotateRepoIfNeeded = async (currentRepo, fileSizeMB) => {
  const projectedSize = currentRepo.currentSize + fileSizeMB;
  if (projectedSize >= getMaxSize()) {
    await Repository.findByIdAndUpdate(currentRepo._id, { isActive: false });
    const repoCount = await Repository.countDocuments();
    const newRepo = await createNewRepo(repoCount + 1);
    return newRepo;
  }
  return currentRepo;
};

export const uploadToGitHub = async (fileBuffer, filename, mimeType) => {
  try {
    let activeRepo = await getActiveRepo();
    const fileSizeMB = fileBuffer.length / (1024 * 1024);
    activeRepo = await rotateRepoIfNeeded(activeRepo, fileSizeMB);

    const base64Content = fileBuffer.toString('base64');
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${filename.replace(/\s+/g, '_')}`;
    const filePath = `images/${safeFilename}`;

    const response = await getOctokit().repos.createOrUpdateFileContents({
      owner: getUsername(),
      repo: activeRepo.repoName,
      path: filePath,
      message: `Upload ${safeFilename}`,
      content: base64Content,
    });

    await Repository.findByIdAndUpdate(activeRepo._id, {
      $inc: { currentSize: fileSizeMB },
    });

    const rawUrl = `https://raw.githubusercontent.com/${getUsername()}/${activeRepo.repoName}/main/${filePath}`;

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

export const deleteFromGitHub = async (repoName, filename, fileSha) => {
  try {
    await getOctokit().repos.deleteFile({
      owner: getUsername(),
      repo: repoName,
      path: `images/${filename}`,
      message: `Delete ${filename}`,
      sha: fileSha,
    });
  } catch (error) {
    throw new Error(`GitHub delete failed: ${error.message}`);
  }
};