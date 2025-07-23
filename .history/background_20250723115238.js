chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "oauth") {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=Ov23lieYKdpuAb55N8zU&scope=repo`;

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true,
    }, async (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error(chrome.runtime.lastError);
        sendResponse({ success: false });
        return;
      }

      const url = new URL(redirectUrl);
      const code = url.searchParams.get("code");

      // ⬇️ Exchange code for token via backend
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
            console.log("Token saved.");
            sendResponse({ success: true });
          });
        } else {
          console.error("Token not received");
          sendResponse({ success: false });
        }
      } catch (error) {
        console.error("Token exchange failed", error);
        sendResponse({ success: false });
      }
    });

    // Return true to indicate sendResponse is async
    return true;
  }
});
