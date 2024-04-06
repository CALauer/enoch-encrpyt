The `enoch-encrypt` module is a Node.js package providing robust AES-256-GCM
encryption, designed to secure your applications by ensuring the
confidentiality, integrity, and authenticity of your data. It features key
rotation, versioning, and customizable encryption parameters, offering a
comprehensive solution for your encryption needs.

## Features

- AES-256-GCM encryption and decryption for high security.
- Secure key generation using PBKDF2 with configurable iterations, key length,
  and salt size.
- Support for key rotation and versioning to enhance security further.
- Customizable encryption settings via a simple JSON configuration.
- Option for integration with external key storage solutions for improved key
  management.

## Installation

Install `enoch-encrypt` into your Node.js project with npm:

```bash
npm install enoch-encrypt
```

## Configuration

Configure enoch-encrypt by creating a config.json file in the root of your
project. Example configuration:

```json
{
  "useKeyStore": true,
  "encryptionSettings": {
    "iterations": 215000,
    "keyLength": 64,
    "saltSize": 64
  }
}
```

- `useKeyStore`: Enables integration with key storage solutions. Implement as
  needed.
- `encryptionSettings`: Customize iterations, keyLength, and saltSize as per
  your security requirements

## Usage

To use `enoch-encrypt`, ensure you have set the `SECURE_PASSPHRASE` environment
variable securely. Here's a basic usage example:

```javascript
const { ENCRYPT, DECRYPT, ROTATE_KEY } = require("enoch-encrypt");
const passphrase = process.env.SECURE_PASSPHRASE; // Securely set this variable

// Initialize or rotate to a new key before encryption
ROTATE_KEY(passphrase);

// Encrypt a message
const encryptedText = ENCRYPT("Hello, World!", passphrase);
console.log("Encrypted:", encryptedText);

// Decrypt the message
const decryptedText = DECRYPT(encryptedText, passphrase);
console.log("Decrypted:", decryptedText);
```

## Security Notes

- Securely manage the `SECURE_PASSPHRASE` environment variable; do not hard-code
  it.
- Regularly rotate encryption keys and update the `config.json` settings to meet
  evolving security standards.
- In production, utilize a secure key management system (KMS) by setting
  `useKeyStore` to `true` for enhanced key management.

## Contributing

I welcome contributions to enoch-encrypt! Please feel free to submit pull
requests or open issues to propose changes or discuss enhancements.
[GitHub Repository](https://github.com/CALauer/enoch-encrpyt)

## License

`enoch-encrypt` is available under the MIT License. See the LICENSE file in the
repository for more information.

```

```

