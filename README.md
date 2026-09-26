# WACEwise — WACE Vault AI study companion

A Chrome Manifest V3 side-panel extension for studying alongside [WACE Vault](https://wacevault.com). Independent project; not affiliated with WACE Vault or SCSA.

## Install

1. Download and unzip `wace-study-companion.zip` (or use this project folder).
2. In Chrome, visit `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select the `wace-study-companion` folder containing `manifest.json`.
3. Visit `https://wacevault.com`, open a subject folder and click the extension's toolbar icon. If needed, pin it from the puzzle-piece menu.
4. Open Settings from the top island and select **Chrome on-device (Gemini Nano)** or **OpenAI API**. For on-device mode, use **Set up on-device model** if prompted. For OpenAI, enter your own key (API billing may apply). Save your choice.
5. Click **Choose file** to select a PDF on the current directory page, or right-click a resource link and choose **Study this resource with AI**. Click **Refresh page** after navigating. Highlight text on an HTML page and refresh, or right-click a selection and choose **Explain selection with AI**.

## Features

- Tutor, Practice and Explain modes; practice mode asks for an attempt before revealing a solution.
- Reads the active WACE Vault page or an individual linked PDF and sends a limited excerpt with your question to OpenAI.
- Extracts selectable text from **all PDF pages** (files up to 35 MB). The entire document is searchable in the current panel session; for each question, the most relevant page excerpts are selected within the model’s context budget (24,000 characters for OpenAI; 5,000 for on-device AI). Scanned/image-only PDFs need OCR and are not supported.
- Saves your API key, model choice and latest conversation locally in Chrome extension storage. No server is operated by this extension. Clear chat from Settings.
- Supports PDF links on WACE Vault; other file formats are not parsed. This tool does not bulk-download or crawl resources.

## Privacy & caveats

In on-device mode, model inference runs locally in Chrome; prompts are not sent to OpenAI. In OpenAI mode, selected resource text, your question and recent chat history are sent to OpenAI when you press Send. The API key is stored locally in Chrome extension storage (not encrypted by this extension). Use a restricted-budget key if possible. No data is sent before you ask a question. AI may be wrong; verify against official marking keys. If you change resources, clear the conversation to prevent unrelated earlier chat from influencing your answers. PDF extraction may flatten tables or equations.

## Technical

No build step or external runtime libraries are required. PDF.js 3.11.174 is vendored in `vendor/` (Mozilla Public License 2.0; see [PDF.js](https://github.com/mozilla/pdf.js)). Chrome 116+ recommended for side-panel support. API endpoint: OpenAI Chat Completions with `gpt-4o-mini` by default.

## On-device AI

Chrome desktop 138+ supports the Prompt API for extensions on eligible devices. Chrome may need to download its model first; availability depends on hardware, storage and browser policy. Select Chrome on-device in Settings, check its status and click **Set up on-device model** if offered. There is no API key or OpenAI charge for this mode. The local model receives relevant excerpts (up to 5,000 characters) selected from all indexed pages and recent messages because its context window is smaller. It may be less capable on complicated exam problems. If the browser reports the model unavailable, select OpenAI instead; there is no automatic fallback to the cloud. See [Chrome Prompt API documentation](https://developer.chrome.com/docs/ai/prompt-api).

## Finding WACE Vault sources

Open the island → Resources. Folder pages contain links, not study content: press **Choose file** and browse subfolders until you select a PDF. The extension reads folder listings directly from WACE Vault, so the site loading animation does not block detection. PDFs are parsed from their URL (all pages), and navigating between WACE Vault tabs updates the current folder. You can also highlight text on a page and click Refresh page.

WACE Vault may display PDFs through a `?view=` HTML preview URL. The extension resolves that viewer URL to its direct PDF before extracting text.

## Context-aware questions

When you have WACE Vault’s built-in PDF viewer open, the extension attempts to detect its current PDF page and any highlighted text before each question. The tutor prioritises that page for vague questions such as “How do I do this?”. If the viewer exposes no page information, or multiple questions are visible on the same page, the tutor should ask what you mean rather than pretend to know. Page detection depends on WACE Vault’s EmbedPDF viewer and may break if its internals change.

## GitHub update checks

See [PUBLISHING.md](PUBLISHING.md). Set your public GitHub repository URL in Settings to receive update notices in the island. An unpacked extension cannot install its own updates; use the included PowerShell script to pull changes and then Reload in Chrome. Later, a Chrome Web Store release can update automatically.

## Chat rendering and in-flight requests

AI replies render `**bold**` as bold text safely (without interpreting arbitrary HTML). When you submit a question, the extension freezes the current source text, indexed pages, selected page and study mode for that request so navigating WACE Vault while the answer is generated does not change its context. The side panel must remain open during the request. Island notifications contract automatically after a few seconds.

## Streaming and interactive activities

While the model prepares a reply, the chat shows rotating **task-status messages**, not the model's private reasoning. Replies stream into the conversation with a typing effect when supported by the selected provider. The **Make an activity for this topic** button asks the tutor to generate a small interactive HTML/CSS/JS study exercise; the tutor may also propose one unprompted. These are opt-in: click **Open activity** to run it. Generated activities run in a separate Chrome extension sandbox page with an opaque origin, no Chrome extension APIs, and a restrictive content security policy that blocks network requests. Do not enter personal information into an AI-created activity. An activity may be incorrect or not work; always verify exam facts against the source material.

## Stop generation

While a reply is generating, press **Stop** beside the message input. This aborts the OpenAI stream or Chrome on-device prompt, stops the typing effect, and keeps any partial answer already received with a “Response stopped” label. If no text has arrived yet, your question stays in the conversation so you can retry.
