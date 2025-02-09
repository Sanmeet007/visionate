import imageType from "image-type";

interface ImageMetadata {
  url: string;
  mimeType: string;
  extension: string;
  sizeInBytes: number;
}

const userAgents: string[] = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.129 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/537.36",
  "Mozilla/5.0 (Linux; U; Android 12; en-us; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36",
];

const getRandomUserAgent = (): string => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

const getImageMetadataFromUrl = async (
  imageUrl: string
): Promise<ImageMetadata | { error: string }> => {
  try {
    const response = await fetch(imageUrl, {
      headers: { "User-Agent": getRandomUserAgent() },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const type = await imageType(Buffer.from(buffer));

    if (!type) {
      return { error: "Invalid or unknown image format" };
    }

    return {
      url: imageUrl,
      mimeType: type.mime,
      extension: type.ext,
      sizeInBytes: buffer.byteLength,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

const getImageMetadataFromFile = async (
  file: File
): Promise<ImageMetadata | { error: string }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const type = await imageType(buffer);

    if (!type) {
      return { error: "Invalid or unknown image format" };
    }

    return {
      url: "",
      mimeType: type.mime,
      extension: type.ext,
      sizeInBytes: file.size,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export { getImageMetadataFromUrl, getImageMetadataFromFile };
