import crypto from "node:crypto";

function getKey(secret: string): string {
  return crypto
    .createHash("sha256")
    .update(String(secret))
    .digest("hex")
    .substring(0, 32);
}

function encrypt(text: string, secret: string): string {
  const keyString = getKey(secret);
  const key = Buffer.from(keyString, "utf-8");
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedText: string, secret: string): string | null {
  try {
    const keyString = getKey(secret);
    const key = Buffer.from(keyString, "utf-8");

    const parts = encryptedText.split(":");
    if (parts.length !== 2) {
      console.error(
        "Decryption failed: Invalid encrypted text format. Expected 'iv:encryptedData'."
      );
      return null;
    }

    const iv = Buffer.from(parts[0], "hex");
    const encryptedDataHex = parts[1];

    if (iv.length !== 16) {
      console.error("Decryption failed: Invalid IV length. Expected 16 bytes.");
      return null;
    }

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    const encryptedDataBuffer = Buffer.from(encryptedDataHex, "hex");
    let decrypted = decipher.update(encryptedDataBuffer, undefined, "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Invalid key length")) {
        console.error(
          "Decryption failed: Invalid key length. Ensure the secret derives to a 32-byte key."
        );
      } else if (
        error.message.includes("bad decrypt") ||
        error.message.includes("wrong final block length")
      ) {
        console.error(
          "Decryption failed: Bad decrypt. This often means the key or IV is incorrect, or the data is corrupted."
        );
      } else {
        console.error("Decryption failed:", error.message, error.stack);
      }
    } else {
      console.error("Decryption failed with an unknown error:", error);
    }
    return null;
  }
}

export { encrypt, decrypt };
