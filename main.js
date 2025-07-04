document.addEventListener("DOMContentLoaded", () => { //読み込み直後処理
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => { //今開いているタブ
        chrome.tabs.sendMessage(tabs[0].id, {}, (res) => { //メッセージを送る
            setTimeout( () => { window.close(); }, 700); //0.7秒後にpopup.htmlを閉じる
        });
    });
});