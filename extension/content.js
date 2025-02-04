const kReleaseMode = false;

const getImagesWithoutAlt = () => {
  let imagesWithoutAlt = [];

  try {
    imagesWithoutAlt = document.querySelectorAll("img:not([alt])");
  } catch (e) {
    const images = document.querySelectorAll("img");
    imagesWithoutAlt = Array.from(images).filter(
      (img) => !img.hasAttribute("alt")
    );
  }

  return imagesWithoutAlt;
};

const getAltTextFromImageSrc = async (imgSrc) => {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 2000);
  });

  return "<CAPTION-DATA>";
};

const images = getImagesWithoutAlt();

if (!kReleaseMode) {
  console.debug("--- EXTENSION LOG START ---");

  images.forEach(async (img) => {
    try {
      console.debug("[EXTENSION] : Getting caption for", img);
      const captionData = await getAltTextFromImageSrc(img.src);
      img.alt = captionData;
    } catch (e) {
      console.log(e);
      console.error("Unable to get caption for : ", img);
    }
  });

  console.debug("--- EXTENSION LOG END  ---");
} else {
  // handle production logic here
}
