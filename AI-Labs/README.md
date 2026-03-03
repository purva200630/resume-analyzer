# Portfolio Website

A modern, interactive portfolio website generated from `profile.json` data.

## 🚀 How to Run Locally

You can run this project using a simple HTTP server.

### Option 1: Live Server (VS Code Extension)
1. Open `index.html` in VS Code.
2. Click "Go Live" at the bottom right.

### Option 2: Python HTTP Server
1. Open a terminal in this folder.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser.

## 📝 Setup Instructions

### 1. Google Form Integration
To make the "Contact Me" button work:
1. Create a Google Form.
2. Click **Send** -> **Link** tab -> Copy the URL.
3. Open `script.js`.
4. Replace `PASTE_GOOGLE_FORM_LINK_HERE` with your copied URL.
   ```javascript
   const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/YOUR-FORM-ID/viewform";
   ```

### 2. Updating Profile Data
- Edits to `profile.json` are automatically reflected on the website.
- Ensure the JSON structure remains valid.

## ✨ Features
- **Dynamic Content**: Powered by `profile.json`.
- **Theme**: Dark/Light mode toggle (saved in localStorage).
- **Animations**: Soft scroll-reveal and cursor effects.
- **Glassmorphism**: Premium UI cards.
- **Responsive**: Mobile-friendly layout.
