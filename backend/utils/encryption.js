import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();


console.log("KEY:", process.env.ENCRYPTION_KEY);

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text) => {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};