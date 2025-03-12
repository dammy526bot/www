// 黑名單網站列表
const blackList = [
  "examplemalicious.com",
  "phishingdomain.com",
  "suspicioussite.org"
];

// 檢查網站是否在黑名單中
function isInBlackList(url) {
  const urlDomain = new URL(url).hostname; // 解析網址的主機名
  return blackList.some(domain => urlDomain.includes(domain));
}

// 檢查是否使用 HTTPS 協議
function isHttps(url) {
  return url.startsWith("https://");
}

// 通過 Google Safe Browsing API 檢查網站是否安全
async function checkGoogleSafeBrowsing(url) {
  const apiKey = 'AIzaSyBI9HvTDeHEjlh-XY12-_S23Lvzd7d0d6w';  // 在這裡填入您的 Google API 密鑰
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const requestData = {
      "client": {
          "clientId": "your_client_id",  // 可以自訂
          "clientVersion": "1.0"
      },
      "threatInfo": {
          "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
          "platformTypes": ["ANY_PLATFORM"],
          "threatEntryTypes": ["URL"],
          "threatEntries": [
              { "url": url }
          ]
      }
  };

  try {
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      });
      const data = await response.json();

      // 如果結果為空，表示網站不被標註為不安全
      return data.matches && data.matches.length > 0;
  } catch (error) {
      console.error("Error checking Google Safe Browsing API:", error);
      return false;
  }
}

// 核心檢查函式
async function checkWebsiteSecurity() {
  const url = document.getElementById("urlInput").value; // 獲取使用者輸入的網址
  const resultDiv = document.getElementById("result"); // 顯示結果的區域
  
  // 檢查是否輸入有效網址
  if (!url) {
      resultDiv.textContent = "請輸入一個有效的網站網址!";
      return;
  }

  // 檢查網站是否在黑名單中
  if (isInBlackList(url)) {
      resultDiv.textContent = "警告！這個網站在黑名單中，請小心！";
      return;
  }

  // 檢查網站是否使用 HTTPS
  if (!isHttps(url)) {
      resultDiv.textContent = "警告！這個網站沒有使用 HTTPS，請注意網站安全！";
      return;
  }

  // 使用 Google Safe Browsing API 檢查網站
  const isUnsafe = await checkGoogleSafeBrowsing(url);

  if (isUnsafe) {
      resultDiv.textContent = "警告！這個網站被 Google 標註為不安全，請小心！";
      return;
  }

  // 如果網站通過所有檢查，顯示安全
  resultDiv.textContent = "這個網站是安全的！";
}

// 監聽按鈕點擊事件
document.getElementById("checkButton").addEventListener("click", checkWebsiteSecurity);
