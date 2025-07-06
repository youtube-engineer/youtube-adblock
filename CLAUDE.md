# CLAUDE.md
必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that blocks advertisements by replacing them with custom video content. The extension focuses on defensive ad-blocking functionality for educational purposes.

## Architecture

The extension consists of:

- **manifest.json**: Chrome extension manifest (v3) that defines permissions, content scripts, and popup configuration
- **adBlock.js**: Main content script that runs on all HTTP/HTTPS pages. Contains the core ad-blocking logic that:
  - Detects iframe elements and replaces them with a custom video (insert.mp4)
  - Uses MutationObserver to handle dynamically added content
  - Provides fallback handling for unsupported browsers
- **main.js**: Popup script that communicates with the content script and closes the popup after execution
- **popup.html**: Simple popup interface shown when the extension icon is clicked
- **insert.mp4**: Custom video file used to replace blocked advertisements

## Key Components

### Content Script (adBlock.js)
- `adBlock()`: Main function that processes and replaces ad elements
- `processElements()`: Helper function that creates video elements and replaces target elements
- Uses `chrome.runtime.getURL()` to access the bundled video file
- Implements MutationObserver for dynamic content detection

### Popup System
- **popup.html**: Simple interface displaying "AdBlocked" message
- **main.js**: Handles popup interactions and communicates with content script via Chrome messaging API

## Development Notes

- The extension uses Chrome Extension Manifest V3
- Content script runs on all HTTP/HTTPS pages as defined in manifest.json
- Video replacement maintains original element dimensions with minimum size constraints
- All text content is in Japanese, indicating this is primarily for Japanese web browsing

## File Structure

```
AdBlock/
├── manifest.json          # Extension configuration
├── adBlock.js            # Main content script
├── main.js               # Popup script
├── popup.html            # Popup interface
├── insert.mp4            # Replacement video
└── README.md             # Project description (Japanese)
```

## Extension Permissions

- `tabs`: Required for popup communication with active tab
- Matches all HTTP/HTTPS pages for content script injection
- Web accessible resources for video file access