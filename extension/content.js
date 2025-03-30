const kReleaseMode = false;

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
  let imagesWithoutAlt = [];

  try {
    imagesWithoutAlt = Array.from(document.querySelectorAll("img:not([alt])"));
  } catch (e) {
    const images = document.querySelectorAll("img");
    imagesWithoutAlt = Array.from(images).filter(
      (img) => !img.hasAttribute("alt")
    );
  }

  return imagesWithoutAlt;
};

const getAltTextFromImageSrc = async (apiKey, imgEl) => {
  try {
    const res = await fetch("http://localhost:3000/api/generate-caption", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: imgEl.src,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      return "<CAPTIONS-NOT-AVAILABLE>";
    }
  } catch (E) {
    return "<CAPTIONS-NOT-AVAILABLE>";
  }
};

(async () => {
  const images = getImagesWithoutAlt();

  if (!kReleaseMode) {
    console.debug("--- EXTENSION LOG START ---");

    const apiKey = await getApiKey();
    if (!apiKey) {
      console.log("NO API KEY FOUND PLEASE CONFIGURE YOUR API KEY");
      return;
    }

    images.forEach(async (imgEl) => {
      try {
        console.debug("[EXTENSION] : Getting caption for", imgEl);
        const captionData = await getAltTextFromImageSrc(apiKey, imgEl);
        imgEl.alt = captionData;
      } catch (e) {
        console.log(e);
        console.error("Unable to get caption for : ", imgEl);
      }
    });

    console.debug("--- EXTENSION LOG END  ---");
  } else {
    const apiKey = await getApiKey();
    if (!apiKey) return;

    images.forEach(async (imgEl) => {
      try {
        const captionData = await getAltTextFromImageSrc(apiKey, imgEl);
        imgEl.alt = captionData;
      } catch (e) {
        return;
      }
    });
  }
})();
