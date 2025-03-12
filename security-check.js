// 黑名單網站範例
const blackList = [
  "examplemalicious.com",
  "malwaredomain.com",
  "phishingdomain.org",
  "discord.com" // 模擬可疑網站
];

// 儲存已檢查過的網站
const visitedWebsites = {};

// 檢查網站是否在黑名單中
function isInBlackList(url) {
  const urlDomain = new URL(url).hostname;
  return blackList.some(domain => urlDomain.includes(domain));
}

// 檢查是否使用 HTTPS
function isHttps(url) {
  return url.startsWith("https://");
}

// 檢查網站標頭是否包含安全標頭
async function hasSecureHeaders(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = response.headers;
    if (headers.has("Strict-Transport-Security") && headers.has("Content-Security-Policy")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("標頭檢查錯誤:", error);
    return false;
  }
}

// 檢查網站格式是否正確
function isValidUrlFormat(url) {
  try {
    new URL(url); // 嘗試解析 URL
    return true;
  } catch (error) {
    return false;
  }
}

// 核心檢查函式
export async function checkWebsiteSecurity(url) {
  // 檢查 URL 是否已經檢查過
  if (visitedWebsites[url]) {
    return visitedWebsites[url]; // 返回先前檢查結果
  }

  // 檢查 URL 格式是否有效
  if (!isValidUrlFormat(url)) {
    return "網站 URL 格式無效！";
  }

  // 1. 檢查是否在黑名單中
  if (isInBlackList(url)) {
    visitedWebsites[url] = "這個網站是可疑的，屬於黑名單！";
    return visitedWebsites[url];
  }

  // 2. 檢查是否使用 HTTPS
  if (!isHttps(url)) {
    visitedWebsites[url] = "這個網站沒有使用 HTTPS，連接不安全！";
    return visitedWebsites[url];
  }

  // 3. 檢查網站是否有安全標頭
  const secureHeaders = await hasSecureHeaders(url);
  if (!secureHeaders) {
    visitedWebsites[url] = "這個網站缺少安全標頭，可能不安全！";
    return visitedWebsites[url];
  }

  // 如果網站通過所有檢查，顯示安全
  visitedWebsites[url] = "這個網站是安全的！";
  return visitedWebsites[url];
}

