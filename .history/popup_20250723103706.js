document.getElementById("push").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.querySelector('.view-lines')?.innerText,
  }, async (results) => {
    const code = results[0].result;
    const token = document.getElementById("token").value;
    const repo = document.getElementById("repo").value;
    const filename = document.getElementById("filename").value;

    const apiUrl = `https://api.github.com/repos/YOUR_USERNAME/${repo}/contents/${filename}`;
    const base64Content = btoa(unescape(encodeURIComponent(code)));

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Added ${filename}`,
        content: base64Content
      })
    });

    const data = await response.json();
    if (data.content) alert("✅ Code pushed to GitHub!");
    else alert("❌ Failed: " + JSON.stringify(data));
  });
});
