document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("authBtn");
  const pushBtn = document.getElementById("pushBtn");
  const statusDiv = document.getElementById("status");

  const BACKEND_URL = 'http://localhost:3000';

  authBtn.onclick = () => {
    chrome.runtime.sendMessage({ type: "github-auth" }, (response) => {
      if (response?.success) {
        statusDiv.innerText = "✅ Authenticated!";
      } else {
        statusDiv.innerText = "❌ Auth failed.";
      }
    });
  };

  pushBtn.onclick = () => {
    const repo = document.getElementById("repo").value;
    const filename = document.getElementById("filename").value;
    const code = document.getElementById("code").value;

    chrome.storage.local.get("github_token", async (items) => {
      const token = items.github_token;
      if (!token) {
        statusDiv.innerText = "Please authenticate first.";
        return;
      }

      const content = btoa(code);
      const res = await fetch(`https://api.github.com/repos/YOUR_USERNAME/${repo}/contents/${filename}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add ${filename}`,
          content: content,
        }),
      });

      if (res.ok) {
        statusDiv.innerText = "✅ Code pushed successfully!";
      } else {
        const err = await res.json();
        statusDiv.innerText = "❌ Failed: " + err.message;
      }
    });
  };
});
