import crypto from 'crypto';

// Mengambil kunci rahasia dari file .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; 
const ALGORITHM = 'aes-256-gcm';

export function encryptApiKey(apiKey) {
  // Validasi: Pastikan panjang key tepat 32 karakter (256 bit)
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY di .env harus tepat 32 karakter!");
  }

  // Initialization Vector (IV) - Acak untuk setiap enkripsi
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Auth Tag memastikan data tidak diubah oleh pihak ketiga (tampering)
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedKey: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag
  };
}

export function decryptApiKey(encryptedKey, iv, authTag) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    Buffer.from(ENCRYPTION_KEY), 
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function generateRandomApiKey() {
  // Hasilnya akan seperti: fosht_a1b2c3d4e5f6...
  return 'fosht_' + crypto.randomBytes(24).toString('hex');
}