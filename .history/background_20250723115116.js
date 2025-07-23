fetch('http://localhost:3000/auth/github', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code }),
})
  .then(res => res.json())
  .then(data => {
    const token = data.access_token;
    chrome.storage.local.set({ github_token: token }, () => {
      sendResponse({ success: true });
    });
  })
  .catch(err => {
    console.error(err);
    sendResponse({ success: false });
  });
