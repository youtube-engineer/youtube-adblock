// Function to block ads and replace with your video
const adBlock = () => {
    // Helper function to process and replace elements with video
    const processElements = (elements, videoSrc) => { // videoSrc を必須の引数として定義
        Array.from(elements).forEach((el) => {
            if (!document.body.contains(el)) {
                return;
            }

            // <video>要素を作成
            const videoElement = document.createElement("video");
            videoElement.src = videoSrc; // クラス名を追加してスタイル適用可能に
            videoElement.controls = true; // 再生コントロールを表示
            videoElement.autoplay = true; // 自動再生（注意して使用）
            videoElement.loop = true;     // ループ再生
            videoElement.muted = true;    // 自動再生のためにミュートを推奨

            // <source>要素を作成し、動画のパスとタイプを設定
            const sourceElement = document.createElement("source");
            sourceElement.src = videoSrc;
            sourceElement.type = "video/mp4"; // あなたの動画のMIMEタイプに合わせて変更

            videoElement.appendChild(sourceElement);

            // ブラウザが<video>タグをサポートしていない場合の代替テキスト
            const fallbackText = document.createElement("p");
            fallbackText.textContent = "お使いのブラウザは動画をサポートしていません。";
            videoElement.appendChild(fallbackText);

            // 動画要素のスタイルを設定
            videoElement.style.cssText = `
                background-color: #000; /* 動画の背景色 */
                max-width: 100%;
                height: auto;
                display: block; /* 余分なスペースをなくす */
                border: 1px solid #ccc;
                margin: 5px 0;
            `;

            // 元の広告要素のサイズを参考に置き換える要素のサイズを設定
            // 元の要素のサイズが小さい場合でも、ある程度の表示領域を確保
            const originalWidth = el.offsetWidth;
            const originalHeight = el.offsetHeight;

            videoElement.style.width = (originalWidth > 100 ? originalWidth : 300) + 'px'; // 最小幅100px、デフォルト300px
            videoElement.style.height = (originalHeight > 50 ? originalHeight : 200) + 'px'; // 最小高さ50px、デフォルト200px

            // もし元の要素が非常に小さかった場合、min-width/min-heightで最低限のサイズを保証
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

    // --- Specific Ad Element Replacement with your video ---

    // 例: iframeタグを自分の動画で置き換える場合
    // "path/to/your-video.mp4" をあなたの動画ファイルの実際のパスに置き換えてください
    const videoFilePath = chrome.runtime.getURL("insert.mp4");
    console.log("動画ファイルのパス:", videoFilePath);

    processElements(document.getElementsByTagName("iframe"), videoFilePath);

    // 例: yjAdImageクラスの要素を別の動画で置き換える場合
    // processElements(document.getElementsByClassName("yjAdImage"), "path/to/another-video.mp4");

    // もし動画ではなくプレースホルダーメッセージを表示したい要素がある場合は、
    // 別の関数や条件分岐で処理を分ける必要があります。
    // 例: processElements(document.getElementsByClassName("yadsOverlay"), "広告ブロッカーによって削除されました (yadsOverlay)");
    // ↑この場合は、processElements関数を動画用とメッセージ用で分けるか、
    //   引数を増やして条件分岐させる必要があります。
};

// MutationObserver と Event Listeners はそのまま使用できます
const observer = new MutationObserver((mutationsList, observer) => {
    console.log(mutationsList,"mutationsList")
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 新しく追加されたiframeも動画で置き換えたい場合
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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    adBlock();
    sendResponse({ status: "adBlock executed" });
    return true;
});