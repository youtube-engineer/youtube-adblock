// Function to block ads and add a placeholder message
const adBlock = () => {
    // Helper function to process and remove elements
    const processElements = (elements, message) => {
        Array.from(elements).forEach((el) => {
            // Check if the element is still in the DOM and visible (optional, for efficiency)
            if (!document.body.contains(el)) {
                return; // Element already removed or not part of the main DOM
            }

            // Create a placeholder div
            const placeholder = document.createElement("div");
            placeholder.textContent = message;
            placeholder.style.cssText = `
                background-color: #f0f0f0;
                color: #555;
                border: 1px solid #ccc;
                padding: 10px;
                margin: 5px 0;
                text-align: center;
                font-size: 14px;
                font-family: sans-serif;
                min-height: 50px; /* Ensure it's visible */
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Replace the ad element with the placeholder
            if (el.parentNode) {
                // To handle cases where the iframe might be styled to be tiny (width="1" height="1")
                // We ensure the placeholder at least takes up some space visually.
                // You might want to adjust placeholder size based on the original ad's size if larger.
                placeholder.style.width = el.style.width || el.offsetWidth + 'px';
                placeholder.style.height = el.style.height || el.offsetHeight + 'px';
                if (parseInt(placeholder.style.height) < 50) { // Ensure minimum height
                    placeholder.style.minHeight = '50px';
                }
                if (parseInt(placeholder.style.width) < 100) { // Ensure minimum width
                     placeholder.style.minWidth = '100px';
                }


                el.parentNode.replaceChild(placeholder, el);
            } else {
                // If for some reason it has no parent, just remove it
                el.remove();
            }
        });
    };

    // --- Specific Ad Element Removal ---

    // Remove all iframes, with a specific message for them
    processElements(document.getElementsByTagName("iframe"), "広告ブロッカーによって削除されました (iframe)");

    // Remove elements with class "yjAdImage"
    processElements(document.getElementsByClassName("yjAdImage"), "広告ブロッカーによって削除されました (yjAdImage)");

    // Remove elements with class "yadsOverlay"
    processElements(document.getElementsByClassName("yadsOverlay"), "広告ブロッカーによって削除されました (yadsOverlay)");

    // Console log for debugging (optional)
    // console.log("adBlock executed!");
};


// --- MutationObserver to handle dynamically added elements ---
const observer = new MutationObserver((mutationsList, observer) => {
    // Look through all changes that just occurred in the DOM
    console.log(mutationsList,"mutationsList")
    for (const mutation of mutationsList) {
        // If nodes were added
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if any added node is an iframe or contains ad classes
            mutation.addedNodes.forEach(node => {
                // Ensure it's an element node before checking properties
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'IFRAME') {
                        // Found a newly added iframe
                        adBlock(); // Re-run adBlock to catch it
                    } else if (node.querySelector('.yjAdImage, .yadsOverlay')) {
                        // Found a container with specific ad classes
                        adBlock(); // Re-run adBlock
                    }
                }
            });
        }
    }
});

// Start observing the document body for changes in its children (and subtree)
// This will catch elements being added dynamically after initial load
observer.observe(document.body, { childList: true, subtree: true });


// --- Event Listeners (initial and delayed runs) ---

// // 1. When the DOM is fully loaded (initial page load)
// document.addEventListener("DOMContentLoaded", () => {
//     adBlock();
// });

// // 2. When the entire page (including all resources like images) has finished loading
// window.onload = () => {
//     adBlock();
//     // Run again after a short delay, as some ads load asynchronously
//     // These might be redundant if MutationObserver is effective, but good for robustness
//     setTimeout(adBlock, 3000);
//     setTimeout(adBlock, 5000);
// };

// // 3. Listen for messages from other parts of the extension (e.g., background script, popup)
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     adBlock();
//     sendResponse({ status: "adBlock executed" });
//     return true;
// });