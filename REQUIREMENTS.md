# System & Service Requirements 📋

Because GitCloud is a Node.js web application (rather than a Python script), it uses `package.json` to automatically manage its code dependencies. However, to run the app properly, your system and external services must meet the following requirements:

## 1. System Requirements
- **Node.js**: Version 18.x or higher (Version 22.x is currently being used).
- **npm**: Version 9.x or higher (comes bundled with Node.js).
- **Git**: Installed and configured on your machine.

## 2. Database Requirements
- **MongoDB**: You need a running MongoDB database.
  - This can be a local installation (`mongodb://localhost:27017/gitcloud`).
  - Or a cloud-hosted **MongoDB Atlas Cluster** (recommended). You must ensure your current IP address is whitelisted in your Atlas Network Access settings.

## 3. GitHub Account Requirements
Because GitCloud uses GitHub as its storage engine, you must have:
- A valid **GitHub Account**.
- A **Classic Personal Access Token (PAT)** generated from your GitHub Developer Settings.
  - The token *must* have the **`repo`** scope checked (this gives it full control of private repositories so it can create storage repos and upload images).
  - The token should be kept entirely secret. Do not commit it to public code!

## 4. Environment Variables Checklist
Before the app can run, the `.env` file must be present and correctly formatted with:
- `MONGODB_URI` (Must be a valid connection string, without special characters unencoded).
- `JWT_SECRET` (Can be any random 32+ character string).
- `GITHUB_TOKEN` (The classic PAT starting with `ghp_...`).
- `GITHUB_USERNAME` (Your exact GitHub handle).
