document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("authBtn");
  const pushBtn = document.getElementById("pushBtn");
  const statusDiv = document.getElementById("status");

  const CLIENT_ID = 'Ov23lieYKdpuAb55N8zU';
  const REDIRECT_URI = 'https://nnfiocmfbpdaiikcilddnpojpdmdaijp.chromiumapp.org/';
  const BACKEND_URL = 'http://localhost:3000';

  authBtn.onclick = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true,
    }, async (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        statusDiv.innerText = "Authorization failed";
        return;
      }

      const url = new URL(redirectUrl);
      const code = url.searchParams.get("code");

      // Send code to backend
      const res = await fetch(`${BACKEND_URL}/get-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (data.access_token) {
        chrome.storage.local.set({ github_token: data.access_token }, () => {
          statusDiv.innerText = "Authenticated with GitHub!";
        });
      } else {
        statusDiv.innerText = "Token exchange failed.";
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
        statusDiv.innerText = "Please authenticate with GitHub first.";
        return;
      }

      const content = btoa(code); // base64
      const url = `https://api.github.com/repos/YOUR_USERNAME/${repo}/contents/${filename}`;

      const res = await fetch(url, {
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
        statusDiv.innerText = "❌ Failed: " + (err.message || "Unknown error");
      }
    });
  };
});
