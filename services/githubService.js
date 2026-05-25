import { Octokit } from '@octokit/rest';
import Repository from '../models/Repository.js';
import User from '../models/User.js';

const getOctokit = (token) => new Octokit({ auth: token });
const getMaxSize = () => parseInt(process.env.MAX_REPO_SIZE_MB) || 800;

export const getActiveRepo = async (userId) => {
  let repo = await Repository.findOne({ userId, isActive: true });

  if (!repo) {
    const user = await User.findById(userId);
    repo = await Repository.create({
      repoName: 'gitcloud-storage-1',
      currentSize: 0,
      isActive: true,
      userId,
    });

    try {
      const octokit = getOctokit(user.githubToken);
      await octokit.repos.createForAuthenticatedUser({
        name: 'gitcloud-storage-1',
        private: false,
        description: 'GitCloud photo storage',
        auto_init: true,
      });
    } catch (err) {
      console.log('Repo may already exist:', err.message);
    }
  }

  return repo;
};

export const createNewRepo = async (index, userId, token, username) => {
  const repoName = `gitcloud-storage-${index}`;
  try {
    const octokit = getOctokit(token);
    await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: false,
      description: `GitCloud storage repository ${index}`,
      auto_init: true,
    });

    const repo = await Repository.create({
      repoName,
      currentSize: 0,
      isActive: true,
      userId,
    });

    return repo;
  } catch (error) {
    throw new Error(`Failed to create repo: ${error.message}`);
  }
};

export const rotateRepoIfNeeded = async (currentRepo, fileSizeMB, userId, token, username) => {
  const projectedSize = currentRepo.currentSize + fileSizeMB;

  if (projectedSize >= getMaxSize()) {
    await Repository.findByIdAndUpdate(currentRepo._id, { isActive: false });
    const repoCount = await Repository.countDocuments({ userId });
    const newRepo = await createNewRepo(repoCount + 1, userId, token, username);
    return newRepo;
  }

  return currentRepo;
};

export const uploadToGitHub = async (fileBuffer, filename, mimeType, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user.githubToken) {
      throw new Error('GitHub token not found. Please add your GitHub token in settings.');
    }

    const token = user.githubToken;
    const username = user.githubUsername || user.username;
    const octokit = getOctokit(token);

    let activeRepo = await getActiveRepo(userId);
    const fileSizeMB = fileBuffer.length / (1024 * 1024);
    activeRepo = await rotateRepoIfNeeded(activeRepo, fileSizeMB, userId, token, username);

    const base64Content = fileBuffer.toString('base64');
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${filename.replace(/\s+/g, '_')}`;
    const filePath = `images/${safeFilename}`;

    const response = await octokit.repos.createOrUpdateFileContents({
      owner: username,
      repo: activeRepo.repoName,
      path: filePath,
      message: `Upload ${safeFilename}`,
      content: base64Content,
    });

    await Repository.findByIdAndUpdate(activeRepo._id, {
      $inc: { currentSize: fileSizeMB },
    });

    const rawUrl = `https://raw.githubusercontent.com/${username}/${activeRepo.repoName}/main/${filePath}`;

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

export const deleteFromGitHub = async (repoName, filename, fileSha, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user.githubToken) throw new Error('GitHub token not found');

    const username = user.githubUsername || user.username;
    const octokit = getOctokit(user.githubToken);

    await octokit.repos.deleteFile({
      owner: username,
      repo: repoName,
      path: `images/${filename}`,
      message: `Delete ${filename}`,
      sha: fileSha,
    });
  } catch (error) {
    throw new Error(`GitHub delete failed: ${error.message}`);
  }
};