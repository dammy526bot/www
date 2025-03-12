function checkWebsiteSecurity() {
  const url = document.getElementById("url").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";  // 清空先前的結果
  
  if (!url) {
    resultDiv.innerHTML = "<p>請輸入網站 URL</p>";
    return;
  }

  // 檢查 HTTPS
  if (url.startsWith("https://")) {
    resultDiv.innerHTML += "<p>網站使用 HTTPS 加密，安全！</p>";
  } else {
    resultDiv.innerHTML += "<p>警告：網站未使用 HTTPS，加密連接無效！</p>";
  }

  // 檢查 SSL 證書
  checkSSL(url);

  // 檢查安全標頭
  checkSecurityHeaders(url);
}

function checkSSL(url) {
  fetch(url)
    .then(response => {
      if (response.ok) {
        console.log("SSL 證書有效！");
      } else {
        console.log("SSL 證書無效！");
      }
    })
    .catch(error => {
      console.log("無法連接到網站，可能存在 SSL 問題：", error);
    });
}

function checkSecurityHeaders(url) {
  fetch(url, { method: "HEAD" })
    .then(response => {
      const headers = response.headers;
      
      if (headers.has("Strict-Transport-Security")) {
        console.log("網站使用 Strict-Transport-Security 標頭，增強安全！");
      } else {
        console.log("網站缺少 Strict-Transport-Security 標頭！");
      }
      
      if (headers.has("Content-Security-Policy")) {
        console.log("網站使用 Content-Security-Policy 標頭，防範 XSS 攻擊！");
      } else {
        console.log("網站缺少 Content-Security-Policy 標頭！");
      }
    })
    .catch(error => {
      console.log("無法獲取網站標頭，可能存在連接問題：", error);
    });

    function checkSSL(url) {
      const apiUrl = `https://api.ssllabs.com/api/v3/analyze?host=${url}`;
    
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.status === "READY") {
            const grade = data.grade;
            console.log(`SSL 證書等級：${grade}`);
            document.getElementById("result").innerHTML += `<p>SSL 證書等級：${grade}</p>`;
          } else {
            document.getElementById("result").innerHTML += "<p>無法獲取 SSL 證書信息，請稍後再試。</p>";
          }
        })
        .catch(error => {
          console.error("錯誤:", error);
          document.getElementById("result").innerHTML += "<p>無法檢查 SSL 證書，請檢查網站是否存在。</p>";
        });
    }
    
}
