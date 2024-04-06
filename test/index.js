const { ENCRYPT, DECRYPT, ROTATE_KEY } = require("enoch-encrypt");

const passphrase = "mySecretPassphrase";

// Initialize or rotate to a new key before encryption
ROTATE_KEY(passphrase);

const encryptedText = ENCRYPT("Hello, World!", passphrase);
console.log("Encrypted:", encryptedText);

// Decrypt the message
const decryptedText = DECRYPT(encryptedText, passphrase);
console.log("Decrypted:", decryptedText);
