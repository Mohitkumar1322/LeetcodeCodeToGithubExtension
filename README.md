🚀 CodePusher - Chrome Extension to Push Code to GitHub

<img width="785" height="835" alt="image" src="https://github.com/user-attachments/assets/b9ba7fb9-6aad-47c3-98a0-32beb261206e" />

## 📦 Features

- ✅ GitHub OAuth2 Authentication
- ✅ Push code from the extension popup
- ✅ Chrome Extension using Manifest V3
- ✅ Node.js backend for access token exchan

- ## 📁 Project Structure
- CodePusher/
├── popup.html # Extension popup UI
├── popup.js # Handles GitHub auth & UI logic
├── background.js # Manages background OAuth flow
├── manifest.json # Extension manifest (V3)
├── screenshot.png # Preview screenshot (optional)
├── server/ # Backend server
│ ├── server.js
│ ├── .env
│ └── package.json


CLIENT_ID=your_github_client_id
CLIENT_SECRET=your_github_client_secret
node server.js
