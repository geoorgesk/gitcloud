# How to Start GitCloud 🚀

Follow these steps to get your GitCloud application running locally on your machine.

## Step 1: Install Dependencies
GitCloud has two separate parts (Backend and Frontend) that require their own dependencies.

1. **Install Backend Dependencies:**
   Open your terminal in the root `gitcloud` folder and run:
   ```bash
   npm install
   ```

2. **Install Frontend Dependencies:**
   Navigate into the frontend folder and install:
   ```bash
   cd frontend
   npm install
   ```

## Step 2: Configure Environment Variables
You need to set up your `.env` file in the **root** `gitcloud` folder. Create a file named `.env` and paste the following template:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username
MAX_REPO_SIZE_MB=800
```
*(Make sure you replace the placeholder values with your actual database URL and GitHub credentials!)*

## Step 3: Start the Application

You will need to run the backend and the frontend at the same time. You can do this by opening two separate terminal windows.

**Terminal 1 (Backend):**
```bash
# Make sure you are in the root gitcloud folder
npm run dev
```
*You should see "GitCloud server running on port 5000" and "MongoDB Connected".*

**Terminal 2 (Frontend):**
```bash
# Make sure you are inside the frontend folder
cd frontend
npm run dev
```
*You will see a Local network URL (usually http://localhost:5173 or 5174). Open that link in your browser!*

## Step 4: First Time Setup
1. Open the frontend URL in your browser.
2. Register a new user account.
3. Navigate to **Settings** and ensure your GitHub Token is successfully recognized.
4. Go to **Upload**, drag and drop your first photo, and watch the magic happen!
