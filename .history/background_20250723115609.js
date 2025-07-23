chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "auth") {
    const CLIENT_ID = "YOUR_CLIENT_ID"; // Replace with actual GitHub OAuth App client ID

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;

    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error(chrome.runtime.lastError);
        sendResponse({ success: false });
        return;
      }

      const url = new URL(redirectUrl);
      const code = url.searchParams.get("code");

      try {
        const res = await fetch("http://localhost:3000/auth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        const token = data.access_token;

        if (token) {
          chrome.storage.local.set({ github_token: token }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ success: false });
        }
      } catch (err) {
        console.error("Auth error:", err);
        sendResponse({ success: false });
      }
    });

    return true; // keep message channel open
  }
});
