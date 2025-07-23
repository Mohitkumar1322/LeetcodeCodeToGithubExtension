chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "oauth") {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      async (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error(chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError?.message });
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
            sendResponse({ success: false, error: "Token missing" });
          }
        } catch (error) {
          console.error("Error exchanging token:", error);
          sendResponse({ success: false, error: error.message });
        }
      }
    );

    // 🔥 Important: Return true to keep the message channel open
    return true;
  }
});
