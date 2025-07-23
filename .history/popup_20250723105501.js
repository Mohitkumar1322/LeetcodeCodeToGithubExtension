// document.getElementById("push").addEventListener("click", async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => document.querySelector('.view-lines')?.innerText,
//   }, async (results) => {
//     const code = results[0].result;
//     const token = document.getElementById("token").value;
//     const repo = document.getElementById("repo").value;
//     const filename = document.getElementById("filename").value;

//     const apiUrl = `https://api.github.com/repos/Mohitkumar1322/${repo}/contents/${filename}`;
//     const base64Content = btoa(unescape(encodeURIComponent(code)));

//     const response = await fetch(apiUrl, {
//       method: "PUT",
//       headers: {
//         "Authorization": `token ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: `Added ${filename}`,
//         content: base64Content
//       })
//     });

//     const data = await response.json();
//     if (data.content) alert("✅ Code pushed to GitHub!");
//     else alert("❌ Failed: " + JSON.stringify(data));
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  const tokenInput = document.getElementById("token");
  const repoInput = document.getElementById("repo");
  const filenameInput = document.getElementById("filename");
  const codeInput = document.getElementById("code");
  const statusDiv = document.getElementById("status");

  // Load saved inputs
  chrome.storage.local.get(["token", "repo"], (data) => {
    if (data.token) tokenInput.value = data.token;
    if (data.repo) repoInput.value = data.repo;
  });

  document.getElementById("pushBtn").addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    const repo = repoInput.value.trim();
    const filename = filenameInput.value.trim();
    const code = codeInput.value;

    if (!token || !repo || !filename || !code) {
      statusDiv.innerText = "⚠️ Fill all fields!";
      return;
    }

    // Save token & repo
    chrome.storage.local.set({ token, repo });

    const response = await fetch(`https://api.github.com/repos/${await getUsername(token)}/${repo}/contents/${filename}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add ${filename}`,
        content: btoa(code),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      statusDiv.innerText = "✅ Code pushed successfully!";
    } else {
      statusDiv.innerText = `❌ Failed: ${result.message}`;
    }
  });

  async function getUsername(token) {
    const res = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${token}` },
    });
    const userData = await res.json();
    return userData.login;
  }
});
