# Visionate  
**AI-Powered Image Captioning for the Web**

Visionate is a Chrome extension that automatically generates captions for images lacking alt text. It enhances web accessibility by identifying such images on any webpage and providing meaningful, context-aware descriptions in real time.

---

## Features

- **Automatic Image Scanning** – Detects images without alt text as you browse.
- **AI-Based Captions** – Generates accurate and relevant descriptions for supported images.
- **Real-Time Updates** – Instantly inserts generated captions back into the webpage.
- **Flexible Usage Limits** – Caption quota is based on your pricing tier (free or premium).
- **Privacy-Conscious** – Only processes publicly accessible images; private or restricted content is never accessed.

---

## How It Works

1. **Install** the Visionate Chrome extension.
2. While browsing, Visionate **automatically finds images with missing alt text**.
3. It sends **supported and publicly accessible images** to the backend for caption generation.
4. The generated caption is **applied to the image** on the page, improving accessibility and context.

---

## Limitations

- Visionate **cannot generate captions** for:
  - Images behind login walls or authentication
  - CORS-protected blobs or browser-restricted resources
- An **internet connection** is required for AI processing.
- Caption accuracy may vary based on image quality.

---

Certainly! Here's a clean and consistent rewrite of your **"Getting Started (For Developers)"** section:

---

## Getting Started (For Developers)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sanmeet007/project-f.git
   ```

2. **Install dependencies**

* **Captioning model**

  ```bash
  cd caption-model
  pip install -r requirements.txt
  ```

* **Frontend (Website)**

  ```bash
  cd website
  yarn install
  ```

3. **Run the system** *(Windows only for now)*
   From the project root, run the following commands:

   ```bash
   yarn run build      # Build the frontend
   yarn run start      # Start the frontend server
   yarn run model      # Launch the captioning model server
   yarn run proxy      # Start the proxy server
   ```

4. **Load the Chrome extension**

* Open `chrome://extensions/`
* Enable **Developer Mode**
* Click **Load unpacked**
* Select the `extension/` directory from the project
