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
## Screenshots

![Screenshot 1](https://sanmeet007.github.io/public/visionate/screenshot-1.png)
![Screenshot 2](https://sanmeet007.github.io/public/visionate/screenshot-2.png)
![Screenshot 3](https://sanmeet007.github.io/public/visionate/screenshot-3.png)

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

## Getting Started (For Developers)

### Prerequisites
- **Python 3.8+** – For the backend captioning model.
- **Node.js 22+** – For the frontend and proxy server.
- **Yarn** – For managing frontend dependencies.

### Environment Variables Setup

To ensure proper functionality, make sure the following environment variables are configured. You can either set them directly in your environment or store them in a `.env` file in the respective directories.


#### For captioning model
To be placed in the **caption-model** directory.

```bash
TF_ENABLE_ONEDNN_OPTS="0"
PORT="8000"
DEBUG="false"
```

#### For website
To be placed in the **website** directory.

```bash
# DB SETTINGS
DB_HOSTNAME="<DB_HOSTNAME>"
DB_PORT="<DB_PORT>"
DB_USERNAME="<DB_USERNAME>"
DB_PASSWORD="<DB_PASSWORD>"
DB_NAME="<DB_NAME>"

# MAIL SETTINGS
SMTP_USER="<SMTP_USER>"
SMTP_PASSWORD="<SMTP_PASSWORD>"
MAIL_VARIABLES_JSON="{"APPNAME":"Visionate","OFFICE_ADDRESS":"<OFFICE_ADDRESS>","WEBSITE_URL":"http://localhost","SOCIAL_LINKS":{"GITHUB":"<GITHUB_URL>","YOUTUBE":"<YOUTUBE_URL>","LINKEDIN":"<LINKEDIN_URL>","FACEBOOK":"<FACEBOOK_URL>"},"ABOUT_US":"http://localhost/about","CONTACT_US":"http://localhost/support","SUPPORT_EMAIL":"<SUPPORT_EMAIL>"}"
MAIL_TEMPLATES_DIR="src/utils/mailer/templates"

# RAZORPAY SETTINGS
RAZORPAY_KEY_SECRET="<RAZORPAY_KEY_SECRET>"
NEXT_PUBLIC_RAZORPAY_KEY_ID="<RAZORPAY_KEY_ID>"

# MODEL SETTINGS
CAPTION_API_ENDPOINT="http://localhost:8000/generate-caption"

# APP SETTINGS
LOGGING_LEVEL="0"
ENABLE_CSRF="false"
SECURITY_STRING="<SECURITY_STRING_RANDOM_STRING>"

# GOOGLE OAUTH SETTINGS
GOOGLE_OAUTH_CLIENT_ID="<GOOGLE_OAUTH_CLIENT_ID>"
GOOGLE_OAUTH_CLIENT_SECRET="<GOOGLE_OAUTH_CLIENT_SECRET>"

# CLOUDINARY CONFIGURATION
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME>"
CLOUDINARY_API="<CLOUDINARY_API>"
CLOUDINARY_API_SECRET="<CLOUDINARY_API_SECRET>"

# RECAPTCHA SETTINGS
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="<RECAPTCHA_SITE_KEY>"
RECAPTCHA_SECRET_KEY="<RECAPTCHA_SECRET_KEY>"

# REACT QUERY SETTINGS
NEXT_PUBLIC_DISABLE_REACT_QUERY_DEV_TOOLS="true"


# PROXY SETTINGS 
TARGET_PORT="3000"

# IP API KEY
APIIP_API_KEY="<APIIP_API_KEY>"

# REDIS SETTINGS
REDIS_URL="<YOUR_REDIS_URL>"

# PUBLIC VARS
NEXT_PUBLIC_DIST_URL="http://localhost/dist/local/visionate-chrome-extension.crx"
NEXT_PUBLIC_ORIGIN="http://localhost"
NEXT_PUBLIC_WEB_DEV_URL="http://sanmeet007.github.io"
NEXT_PUBLIC_WEB_DEV_NAME="Team Ozymandias"
NEXT_PUBLIC_WEBSITE_SOCIAL_LINK_1="/"
NEXT_PUBLIC_WEBSITE_SOCIAL_LINK_2="https://github.com/Sanmeet007/project-f"
NEXT_PUBLIC_WEBSITE_SOCIAL_LINK_3="https://linkedin.com/in/sanmeet007"
```


> **Note:** The CAPTION_API_ENDPOINT variable should point to the captioning model server. If you are running the model locally, use http://localhost:8000/generate-caption. If you are using a cloud service, replace it with the appropriate URL.

> **Note:** The TARGET_PORT variable should point to the port where the website is running. If you are running the website locally, use 3000. If you are using a cloud service, replace it with the appropriate port.

> **Note:** The APIIP_API_KEY variable is required for the IP geolocation service. You can get a free API key from [apiip.net](https://apiip.net/).

>**Note:** Redis database is required for the website to run. You can use any Redis database service or run it locally.


### System setup
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

3. **Database Setup** 
  From the project root, run the following commands: 
  > _Ensure that your database has been created and is currently empty before proceeding._
   ```bash
   cd website
   yarn run db:push
   ```
   

4. **Run the system** *(Windows only for now)*
   From the project root, run the following commands:

   ```bash
   cd website
   mkdir .requests_data
   touch .requests_data/db.sqlite
   yarn run build      # Build the frontend
   yarn run start      # Start the frontend server
   yarn run model      # Launch the captioning model server
   yarn run proxy      # Start the proxy server
   ```

5. **Load the Chrome extension**

* Open `chrome://extensions/`
* Enable **Developer Mode**
* Click **Load unpacked**
* Select the `extension/` directory from the project
