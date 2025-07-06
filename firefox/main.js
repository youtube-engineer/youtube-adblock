document.addEventListener("DOMContentLoaded", () => {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {}, (res) => {
            setTimeout(() => { window.close(); }, 700);
        });
    });
});