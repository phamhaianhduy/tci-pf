import forge from 'node-forge';

let publicKeyCache = null;

export const loadPublicKey = async () => {
  if (publicKeyCache) return publicKeyCache;
  const res = await fetch('/duyphaPublicKey.pem');
  const pem = await res.text();
  publicKeyCache = forge.pki.publicKeyFromPem(pem);
  return publicKeyCache;
};

export const encryptPassword = async (plainPassword) => {
  const publicKey = await loadPublicKey();
  const encryptedBytes = publicKey.encrypt(plainPassword, 'RSA-OAEP');
  return forge.util.encode64(encryptedBytes);
}
