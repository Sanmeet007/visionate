const kReleaseMode = false; // Set to false for debugging

async function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("apiKey", (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data.apiKey || null);
      }
    });
  });
}

const getImagesWithoutAlt = () => {
  let imagesToReturn = [];
  const supportedFormats = [".png", ".jpeg", ".jpg", ".webp"];
  const supportedMimeSubtypes = supportedFormats.map((format) =>
    format.substring(1).toLowerCase()
  );

  try {
    const allImagesMissingAlt = Array.from(
      document.querySelectorAll("img:not([alt])")
    );

    imagesToReturn = allImagesMissingAlt.filter((img) => {
      const imgSrc = (img.src || "").toLowerCase();

      if (!imgSrc) {
        return false;
      }
      if (imgSrc.startsWith("data:image/")) {
        const mimeTypePart = imgSrc.split(";")[0];
        const format = mimeTypePart.substring("data:image/".length);

        return supportedMimeSubtypes.includes(format);
      }
      return supportedFormats.some((suffix) => imgSrc.endsWith(suffix));
    });
  } catch (e) {
    console.error(
      "Error processing images in getImagesWithoutAltAndWithSupportedFormat (try block):",
      e
    );
    const allImgs = Array.from(document.querySelectorAll("img"));
    imagesToReturn = allImgs.filter((img) => {
      if (img.hasAttribute("alt")) {
        return false;
      }

      const imgSrc = (img.src || "").toLowerCase();

      if (!imgSrc) {
        return false;
      }

      if (imgSrc.startsWith("data:image/")) {
        const mimeTypePart = imgSrc.split(";")[0];
        const format = mimeTypePart.substring("data:image/".length);
        return supportedMimeSubtypes.includes(format);
      }
      return supportedFormats.some((suffix) => imgSrc.endsWith(suffix));
    });
  }

  return imagesToReturn;
};

const getAltTextFromImageSrc = async (apiKey, imgEl) => {
  try {
    const formData = new FormData();
    formData.append("imageUrl", imgEl.src);

    const res = await fetch("http://localhost:3000/api/generate-caption", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.caption.trim();
    } else {
      return "<CAPTIONS-NOT-AVAILABLE>";
    }
  } catch (E) {
    if (!kReleaseMode) {
      console.log(E);
    }
    return "<CAPTIONS-NOT-AVAILABLE>";
  }
};

const loaderContainer = document.createElement("div");
const _buildContentHTML = () => {
  loaderContainer.id = "custom-loader";
  loaderContainer.innerHTML = `
  <div class="custom-loader-content" role="alert" aria-live="assertive">
    <div class="custom-loader-spinner" aria-hidden="true"></div>
    <p id="custom-loader-message" aria-live="polite" style="padding:0;padding-top:1rem;margin:0">Loading...</p>
  </div>
`;

  const style = document.createElement("style");
  style.innerHTML = `
  #custom-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999999;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .custom-loader-content {
    box-sizing: border-box;
    font-family: Inter, sans-serif;
    min-width: 150px;
    text-align: center;
    color: white;
    font-size: 1rem;
    background: rgba(0, 0, 0, 0.7);
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
  }

  .custom-loader-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

  document.head.appendChild(style);
  document.body.appendChild(loaderContainer);
};

function showLoader(message = "Loading...") {
  document.getElementById("custom-loader-message").textContent = message;
  loaderContainer.style.visibility = "visible";
  loaderContainer.style.opacity = "1";
}

function hideLoader(message = "Done", delay = 1000) {
  document.getElementById("custom-loader-message").textContent = message;
  setTimeout(() => {
    loaderContainer.style.opacity = "0";
    setTimeout(() => (loaderContainer.style.visibility = "hidden"), 300);
  }, delay);
}

const _main = async () => {
  try {
    const images = getImagesWithoutAlt();

    if (images.length === 0) return;

    showLoader("Generating Captions");

    const apiKey = await getApiKey();
    if (!apiKey) return;

    for (const imgEl of images) {
      try {
        const captionData = await getAltTextFromImageSrc(apiKey, imgEl);
        imgEl.alt = captionData;
      } catch (e) {
        if (!kReleaseMode) {
          console.log(e);
          console.error("Unable to get caption for : ", imgEl);
        }
      }
    }

    setTimeout(() => hideLoader("Captioning complete!", 1000), 3000);
  } catch (e) {
    if (!kReleaseMode) {
      console.log(e);
    }
    hideLoader("Error occurred", 1000);
  }
};

_buildContentHTML();
_main();
