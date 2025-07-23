chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "auth") {
    const CLIENT_ID = 'Ov23lieYKdpuAb55N8zU';
    const REDIRECT_URI = 'https://nnfiocmfbpdaiikcilddnpojpdmdaijp.chromiumapp.org/';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true,
    }, (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        sendResponse({ success: false });
        return;
      }

      const url = new URL(redirectUrl);
      const code = url.searchParams.get("code");
      sendResponse({ success: true, code });
    });

    return true; // Needed to allow async sendResponse
  }
});
