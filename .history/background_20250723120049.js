chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "auth") {
    const CLIENT_ID = "your_github_client_id";
    const REDIRECT_URI = chrome.identity.getRedirectURL();
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Auth failed:", chrome.runtime.lastError);
          sendResponse({ success: false, message: chrome.runtime.lastError.message });
          return;
        }

        const url = new URL(redirectUrl);
        const code = url.searchParams.get("code");
        sendResponse({ success: true, code });
      }
    );

    return true;
  }
});