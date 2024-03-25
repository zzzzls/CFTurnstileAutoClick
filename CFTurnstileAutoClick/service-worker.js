

async function _mouse_click_by_CDP(tid, x, y) {
  await chrome.debugger.sendCommand({ tabId: tid }, 'Input.dispatchMouseEvent', {
    type: "mousePressed", x: x, y: y, button: 'left', clickCount: 1
  })
  await chrome.debugger.sendCommand({ tabId: tid }, 'Input.dispatchMouseEvent', {
    type: "mouseReleased", x: x, y: y, button: 'left', clickCount: 1
  })
}

function randInt(max, min){
  return Math.floor(Math.random() * (max - min + 1)) + min
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 监听脚本发送过来的坐标, 调用 cdp 模拟点击
  const tid = sender.tab.id
  const { x, y } = request

  chrome.debugger.attach({ tabId: tid }, '1.2', async () => {

    // 随机偏移坐标
    let nx = x + 22 + randInt(5, 20)
    let ny = y + 22 + randInt(5, 20)
    await _mouse_click_by_CDP(tid, nx, ny);

    await chrome.debugger.detach({ tabId: tid })
  })
})



var old_document_id = null;

// 监听网络请求, 发现cloudflare流量则注入脚本到对应标签页
chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.method === "POST" && details.documentId !== old_document_id) {
      old_document_id = details.documentId;

      chrome.scripting
        .executeScript({
          target: { tabId: details.tabId },
          files: ["connect.js"],
        }).then(() => {
          console.log(`${details.documentId} 注入成功!`)
        })
    }

    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://challenges.cloudflare.com/cdn-cgi/challenge-platform/*"]},
  ["responseHeaders"]);









