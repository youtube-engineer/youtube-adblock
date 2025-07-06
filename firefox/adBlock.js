// Function to block ads and replace with your video
const adBlock = () => {
    // Helper function to process and replace elements with video
    const processElements = (elements, videoSrc) => {
        Array.from(elements).forEach((el) => {
            if (!document.body.contains(el)) {
                return;
            }

            // <video>要素を作成
            const videoElement = document.createElement("video");
            videoElement.src = videoSrc;
            videoElement.controls = true; // 再生コントロールを表示
            videoElement.autoplay = true; // 自動再生（注意して使用）
            videoElement.loop = true;     // ループ再生
            videoElement.muted = true;    // 自動再生のためにミュートを推奨

            // <source>要素を作成し、動画のパスとタイプを設定
            const sourceElement = document.createElement("source");
            sourceElement.src = videoSrc;
            sourceElement.type = "video/mp4";

            videoElement.appendChild(sourceElement);

            // ブラウザが<video>タグをサポートしていない場合の代替テキスト
            const fallbackText = document.createElement("p");
            fallbackText.textContent = "お使いのブラウザは動画をサポートしていません。";
            videoElement.appendChild(fallbackText);

            // 動画要素のスタイルを設定
            videoElement.style.cssText = `
                background-color: #000;
                max-width: 100%;
                height: auto;
                display: block;
                border: 1px solid #ccc;
                margin: 5px 0;
            `;

            // 元の広告要素のサイズを参考に置き換える要素のサイズを設定
            const originalWidth = el.offsetWidth;
            const originalHeight = el.offsetHeight;

            videoElement.style.width = (originalWidth > 100 ? originalWidth : 300) + 'px';
            videoElement.style.height = (originalHeight > 50 ? originalHeight : 200) + 'px';

            // 最低限のサイズを保証
            if (parseInt(videoElement.style.height) < 50) {
                videoElement.style.minHeight = '50px';
            }
            if (parseInt(videoElement.style.width) < 100) {
                videoElement.style.minWidth = '100px';
            }

            if (el.parentNode) {
                el.parentNode.replaceChild(videoElement, el);
            } else {
                el.remove();
            }
        });
    };

    // Firefox用のリソースURL取得
    const videoFilePath = browser.runtime.getURL("insert.mp4");
    console.log("動画ファイルのパス:", videoFilePath);

    processElements(document.getElementsByTagName("iframe"), videoFilePath);
};

// MutationObserver
const observer = new MutationObserver((mutationsList, observer) => {
    console.log(mutationsList, "mutationsList");
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'IFRAME') {
                        adBlock();
                    } else if (node.querySelector('.yjAdImage, .yadsOverlay')) {
                        adBlock();
                    }
                }
            });
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Firefox用メッセージリスナー
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    adBlock();
    sendResponse({ status: "adBlock executed" });
    return true;
});