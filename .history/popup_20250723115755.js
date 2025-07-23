document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("authBtn");
  const pushBtn = document.getElementById("pushBtn");
  const statusDiv = document.getElementById("status");

  authBtn.onclick = () => {
    chrome.runtime.sendMessage({ type: "auth" }, (response) => {
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

   chrome.runtime.sendMessage({ type: "auth" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error("Auth Error:", chrome.runtime.lastError.message);
    statusDiv.innerText = "Auth failed.";
    return;
  }

  if (response?.success) {
    console.log("Got code:", response.code);
    chrome.storage.local.set({ auth_code: response.code }); // store it
    statusDiv.innerText = "Authenticated!";
  } else {
    statusDiv.innerText = "❌ Authentication failed.";
  }
});

      // Get user login to use dynamically
      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`
        }
      });

      const userData = await userRes.json();
      const username = userData.login;

      const content = btoa(code);

      const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filename}`, {
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
