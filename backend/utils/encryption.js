import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY;

if (!secretKey) {
  throw new Error("ENCRYPTION_KEY is not configured");
}

const key = Buffer.from(secretKey);

if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must decode to exactly 32 bytes");
}

export const encrypt = (text) => {
  // A fresh IV is required for every encryption under the same key.
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text) => {
  const [ivHex, encryptedHex] = text.split(":");

  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted payload");
  }

  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  if (iv.length !== 16) {
    throw new Error("Invalid encryption IV");
  }

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
