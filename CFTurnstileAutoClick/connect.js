
if (window.timer_CFCK === undefined) {
    window.timer_CFCK = setInterval(() => {
        let targetNode = document.querySelector("#turnstile-wrapper iframe") || document.querySelector("#turnstileForm iframe")
        if (targetNode) {
            let rect = targetNode.getBoundingClientRect()
            let x = rect.x
            let y = rect.y
            console.log("pos:", x, y)
            // 提取到复选框坐标后, 发送坐标到 service_worker
            chrome.runtime.sendMessage({ x, y }).then(() => {
                clearInterval(window.timer_CFCK)
            })
        }
    }, 3000)
}

