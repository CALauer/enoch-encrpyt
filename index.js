const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load configuration from config.json
let config = {
  useKeyStore: false,
  encryptionSettings: {
    iterations: 215000,
    keyLength: 64,
    saltSize: 64,
  },
};

const configPath = path.join(__dirname, "config.json");
if (fs.existsSync(configPath)) {
  const configFile = fs.readFileSync(configPath);
  config = { ...config, ...JSON.parse(configFile) };
}

// Mock key storage - in production, replace with secure key management service integration
let keyStore = {};

function GET_CURRENT_KEY_VERSION() {
  const versions = Object.keys(keyStore)
    .map(Number)
    .sort((a, b) => b - a);
  return versions[0] || null;
}

function GENERATE_SALT() {
  return crypto.randomBytes(config.encryptionSettings.saltSize);
}

function GENERATE_KEY(passphrase, salt) {
  const { iterations, keyLength } = config.encryptionSettings;
  if (!passphrase) throw new Error("Passphrase is required");
  return crypto.pbkdf2Sync(passphrase, salt, iterations, keyLength, "sha512");
}

function ROTATE_KEY(passphrase) {
  if (!config.useKeyStore) {
    console.warn(
      "Key store is disabled. ROTATE_KEY operation will not proceed."
    );
    return null;
  }

  const newVersion = GET_CURRENT_KEY_VERSION() + 1 || 1;
  const newSalt = GENERATE_SALT();
  const newKey = GENERATE_KEY(passphrase, newSalt);
  keyStore[newVersion] = { key: newKey, salt: newSalt };
  return newVersion;
}

function GET_KEY_BY_VERSION(version) {
  const keyInfo = keyStore[version];
  if (!keyInfo) throw new Error("Key version does not exist");
  return keyInfo;
}

function ENCRYPT(plaintext, passphrase) {
  const version = GET_CURRENT_KEY_VERSION();
  if (version === null) throw new Error("No encryption keys available");
  const { key } = GET_KEY_BY_VERSION(version);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key.slice(0, 32), iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();
  return `${version}:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

function DECRYPT(ciphertext, passphrase) {
  const parts = ciphertext.split(":");
  if (parts.length !== 4) throw new Error("Invalid ciphertext format");
  const [version, ivHex, tagHex, encrypted] = parts;
  const { key } = GET_KEY_BY_VERSION(Number(version));
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key.slice(0, 32), iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

try {
  const passphrase = process.env.SECURE_PASSPHRASE;
  ROTATE_KEY(passphrase);

  const plaintext = "Hello, World!";
  console.log("Original Text:", plaintext);

  const encryptedText = ENCRYPT(plaintext, passphrase);
  console.log("Encrypted:", encryptedText);

  const decryptedText = DECRYPT(encryptedText, passphrase);
  console.log("Decrypted:", decryptedText);
} catch (error) {
  console.error("Error:", error.message);
}

module.exports = {
  GET_CURRENT_KEY_VERSION,
  GENERATE_SALT,
  GENERATE_KEY,
  ROTATE_KEY,
  GET_KEY_BY_VERSION,
  ENCRYPT,
  DECRYPT,
};
